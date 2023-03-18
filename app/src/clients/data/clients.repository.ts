import axios from "axios";
import dayjs from "dayjs";
import { FileArray, UploadedFile } from "express-fileupload";
import { templateHeader } from "../../../const/var.conts";
import { EnvSms } from "../../../env";
import { excelToJson } from "../../../functions/excelTojson.function";
import { BaseRepository } from "../../../interfaces/repository.interface";
import {
  HttpError,
  HttpErrorResponse,
  MessagesError,
} from "../../../model/errorHttp.model";
import { MessageType } from "../../messages/enum/messageType.enum";
import { Message } from "../../messages/models/message.model";
import { StatisticsRepocitory } from "../../statistics/data/statistics.repository";
import { DataExcelTemplate } from "../interfaces/excelTemplate.interface";
import { ClientsByPageResponse } from "../interfaces/pageResponse.interface";
import { ClientModel, Client } from "../models/clients.model";

export class ClientRepository implements BaseRepository<ClientModel> {
  constructor(private statisticsRepository: StatisticsRepocitory) {}

  async getClientsByText(
    text: string,
    page: number
  ): Promise<ClientsByPageResponse | HttpErrorResponse> {
    try {
      const clients = await Client.find();
      const filterClients = await clients.filter((client) =>
        JSON.stringify(client).toLowerCase().includes(text.toLowerCase())
      );
      const limit = (page + 1) * 50;
      return {
        clients:
          filterClients.length < 50
            ? filterClients
            : filterClients.slice(page * 50, limit),
        page,
        count: filterClients.length,
        nextPage: page + 1,
      };
    } catch (error) {
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async getClientByPage(
    page: number
  ): Promise<ClientsByPageResponse | HttpErrorResponse> {
    try {
      const clients = await Client.find()
        .limit(50)
        .skip(page * 50);
      const count = await Client.count();
      return { clients, count, page, nextPage: page + 1 };
    } catch (error) {
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async createClientToExcel(
    files: FileArray
  ): Promise<boolean | HttpErrorResponse> {
    try {
      if (!files) {
        return new HttpErrorResponse(
          HttpError.RESOURCE_NOT_EXIST,
          {},
          MessagesError.FILE_INVALID
        );
      }
      const excelFile = Object.values(files)[0] as UploadedFile;
      const dataJson = excelToJson(excelFile.data) as DataExcelTemplate[];
      const testData = dataJson[0];
      if (!this.verifyTemplateExcel(testData)) {
        return new HttpErrorResponse(
          HttpError.DATA_INVALID,
          {},
          MessagesError.TEMPLATE_INVALID
        );
      }
      return await this.insertOrUpdateClientsFromExcel(dataJson);
    } catch (error) {
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async getAll(): Promise<HttpErrorResponse | ClientModel[]> {
    try {
      const clients = await Client.find();
      return clients;
    } catch (error) {
      console.error(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async getOne(id: string): Promise<ClientModel | HttpErrorResponse> {
    try {
      const client = await Client.findOne({ _id: id });
      if (!client) {
        return new HttpErrorResponse(HttpError.RESOURCE_NOT_EXIST);
      }
      return client;
    } catch (error) {
      console.error(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async update(
    id: string,
    data: ClientModel
  ): Promise<ClientModel | HttpErrorResponse> {
    try {
      const client = await Client.findByIdAndUpdate({ _id: id }, data);
      if (!client) {
        return new HttpErrorResponse(HttpError.RESOURCE_NOT_EXIST);
      }
      return data;
    } catch (error) {
      console.error(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async create(data: ClientModel): Promise<ClientModel | HttpErrorResponse> {
    try {
      const client = await Client.create(data);
      return client;
    } catch (error) {
      console.error(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async delete(id: string): Promise<boolean | HttpErrorResponse> {
    try {
      const { deletedCount } = await Client.deleteOne({ _id: id });
      return deletedCount > 0;
    } catch (error) {
      console.error(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async sendMessageExpired() {
    try {
      const resp = await Message.findOne({ type: MessageType.VENCIMIENTO });
      if (!resp) {
        return;
      }
      const messageWithoutFormat = resp.message;
      const currentDate = dayjs();
      const date_expiration = currentDate.add(2, "days").format("YYYY-MM-DD");
      const clientExpired = await Client.find({
        date_expiration: `/${date_expiration}/`,
      });
      for (const client of clientExpired) {
        const fecha = dayjs(client.date_expiration).format("DD/MM/YYYY");
        const message = this.formatTextExpired(messageWithoutFormat, {
          placa: client.identification_vehicle,
          fecha,
        });
        await this.sendSms(client.phone_one, message);
        await this.sendSms(client.phone_two, message);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessageBirthDay() {
    try {
      const message = await Message.findOne({ type: MessageType.BIRTHDAY });
      console.log("sms enviado", message?.message);
    } catch (error) {
      console.log(error);
    }
  }

  private verifyTemplateExcel(data: any): boolean {
    const keys = Object.keys(data);
    const set1 = new Set(templateHeader);
    const set2 = new Set(keys);
    const invalid =
      set1.size === set2.size && [...set1].every((val) => set2.has(val));
    return invalid;
  }

  private async insertOrUpdateClientsFromExcel(
    dataExcel: DataExcelTemplate[]
  ): Promise<boolean> {
    const clients = await Client.find();
    for (const data of dataExcel) {
      const clientExist = clients.find(
        (client) => client.identification_vehicle == data.placa
      );
      if (clientExist) {
        await this.updateByIdentificationVehicle(data);
      } else {
        await this.createWithDataExcelTemplate(data);
      }
    }
    return true;
  }

  private async updateByIdentificationVehicle(
    data: DataExcelTemplate
  ): Promise<void | HttpErrorResponse> {
    try {
      await Client.findOneAndUpdate(
        { identification_vehicle: data.placa },
        {
          $set: {
            identification_number: data.cedula,
            phone_one: data.celular_1,
            phone_two: data.celular_2,
            date_expiration: dayjs(data.fecha_vencimiento).toDate(),
            type_vehicle: data.tipo_vehiculo,
            name: data.nombre,
          },
        }
      );
    } catch (error) {
      console.error(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  private async createWithDataExcelTemplate(
    data: DataExcelTemplate
  ): Promise<void | HttpErrorResponse> {
    try {
      await Client.create({
        identification_vehicle: data.placa,
        identification_number: data.cedula,
        phone_one: data.celular_1,
        phone_two: data.celular_2,
        date_expiration: dayjs(data.fecha_vencimiento).toDate(),
        name: data.nombre,
        type_vehicle: data.tipo_vehiculo,
      });
    } catch (error) {
      console.error(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  private formatTextExpired(message: string, values: any) {
    let formatted = message;
    for (const key in values) {
      const regexp = new RegExp(`\\{${key}\\}`, "gi");
      formatted = formatted.replace(regexp, values[key]);
    }
    return formatted;
  }

  private async sendSms(phone: string, message: string) {
    try {
      const url = EnvSms.URL!;
      const response = await axios.get<string>(url, {
        params: {
          username: EnvSms.USER,
          password: EnvSms.PASSWORD,
          msisdn: phone,
          sender: "SENDER",
          message,
        },
      });
      if (response.data.includes("403 Forbidden")) {
        await this.statisticsRepository.create(
          false,
          phone,
          message,
          "403 Forbidden"
        );
        return;
      }
      await this.statisticsRepository.create(true, phone, message);
    } catch (error) {
      console.log(error);
      await this.statisticsRepository.create(false, phone, message, `${error}`);
    }
  }
}
