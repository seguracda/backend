import { HttpError, HttpErrorResponse, MessagesError } from "../../../model/errorHttp.model";
import { Message, MessageModel } from "../models/message.model";

export class MessageRepository {
  async getAll(): Promise<MessageModel[] | HttpErrorResponse> {
    try {
      const messages = await Message.find();
      return messages;
    } catch (error) {
      console.log(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async update(id: string,data: MessageModel): Promise<MessageModel | HttpErrorResponse> {
    try {
      const update = await Message.findOneAndUpdate({_id: id},data);
      if (!update) {
        return new HttpErrorResponse(
          HttpError.RESOURCE_NOT_EXIST,
          {},
          MessagesError.NO_DATA
        );
      }
      return data;
    } catch (error) {
      console.log(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }
}
