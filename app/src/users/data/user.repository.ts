import { BaseRepository } from "../../../interfaces/repository.interface";
import {
  HttpError,
  HttpErrorResponse,
  MessagesError,
} from "../../../model/errorHttp.model";
import {
  User,
  UserModel,
} from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EnvSecret } from "../../../env";
import { LoginResquest } from "../interfaces/loginrequest.interface";

export class UserRepository
  implements BaseRepository<UserModel>
{
  async login(
    {email,password}: LoginResquest
  ): Promise<{ user: UserModel; token: string } | HttpErrorResponse> {
    try {
      let hash = false;
      const user = await User.findOne({ email });
      if (!user) {
        return new HttpErrorResponse(HttpError.RESOURCE_NOT_EXIST);
      }
      hash = await bcrypt.compare(password, user.password);
      if (!hash) {
        return new HttpErrorResponse(
          HttpError.RESOURCE_NOT_EXIST,
          {},
          MessagesError.NO_DATA
        );
      }
      const token = jwt.sign({ ...user }, EnvSecret.SECRET_TOKEN!);
      return { user, token };
    } catch (error) {
      console.log(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async getOne(id: string): Promise<UserModel | HttpErrorResponse> {
    try {
      const user = await User.findOne(
        { _id: id },
        { password: 0, __v: 0 }
      );
      if (!user) {
        return new HttpErrorResponse(
          HttpError.RESOURCE_NOT_EXIST,
          {},
          MessagesError.NO_DATA
        );
      }
      return user;
    } catch (error) {
      console.log(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR);
    }
  }

  async getAll(): Promise<HttpErrorResponse | UserModel[]> {
    try {
      const users = await User.find(
        {},
        { password: 0, __v: 0 }
      );
      return users;
    } catch (error) {
      console.log(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR, error);
    }
  }

  async update(
    id: string,
    data: UserModel
  ): Promise<HttpErrorResponse | UserModel> {
    try {
      const update = await User.findOneAndUpdate({ _id: id }, data);
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
      return new HttpErrorResponse(HttpError.SERVER_ERROR,error);
    }
  }

  async create(
    data: UserModel
  ): Promise<HttpErrorResponse | UserModel> {
    try {
      const password = await bcrypt.hash(data.password, 10);
      const user = await User.create({ ...data, password });
      return user;
    } catch (error) {
      console.log(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR,error);
    }
  }

  async delete(id: string): Promise<boolean | HttpErrorResponse> {
    try {
      const {deletedCount} = await User.deleteOne({ _id: id });
      return deletedCount > 0;
    } catch (error) {
      console.log(error);
      return new HttpErrorResponse(HttpError.SERVER_ERROR,error);
    }
  }
}
