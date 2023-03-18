import { ObjectId } from "mongoose";
import { HttpErrorResponse } from "../model/errorHttp.model";

export interface BaseRepository<T> {
  
  getAll(): Promise<T[] | HttpErrorResponse>
   
  getOne(id: string): Promise<T | HttpErrorResponse>

  update(id: string,data: Partial<T>): Promise<T | HttpErrorResponse>

  create(data: T):Promise<T | HttpErrorResponse>

  delete(id: string):Promise<boolean | HttpErrorResponse>
     
}