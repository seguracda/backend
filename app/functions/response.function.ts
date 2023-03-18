import { HttpErrorResponse } from "../model/errorHttp.model";
import { Response } from "express";

export const responseApi = (
  res: Response,
  response: any,
  codeOK: number = 200,
  errorCode: number = 400
) => {
  if (response instanceof HttpErrorResponse) {
    res.status(errorCode).json(response);
  } else res.status(codeOK).json(response);
};


