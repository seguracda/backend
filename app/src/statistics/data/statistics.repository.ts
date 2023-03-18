import { HttpError, HttpErrorResponse } from "../../../model/errorHttp.model";
import { Statistics, StatisticsModel } from "../model/statistics.model";

export class StatisticsRepocitory {
  async getAll(): Promise<StatisticsModel[] | HttpErrorResponse> {
    try {
      const statistics = await Statistics.find();
      return statistics;
    } catch (error) {
      console.log(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async create(
    send: boolean,
    phone: string,
    message: string,
    error?: string
  ): Promise<StatisticsModel | HttpErrorResponse> {
    try {
      const statistics = await Statistics.create({
        phone,
        message,
        send,
        error: send ? "No Error" : error,
      });
      return statistics;
    } catch (error) {
      console.log(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }
}
