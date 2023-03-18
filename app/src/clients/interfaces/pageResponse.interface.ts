import { ClientModel } from "../models/clients.model";

export interface ClientsByPageResponse {
  count: number,
  clients: ClientModel[]
  page: number;
  nextPage: number
}