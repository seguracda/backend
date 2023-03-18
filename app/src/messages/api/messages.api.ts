import { Router, Request, Response } from "express";
import { responseApi } from "../../../functions/response.function";
import { MessageRepository } from "../data/messages.repository";
import { MessageModel } from "../models/message.model";



const router = Router();
const repository = new MessageRepository()

router.get("/", async (req: Request, res: Response) => {
  const response = await repository.getAll()
  responseApi(res, response);
});

router.put("/", async (req: Request, res: Response) => {
  const {id,...data} = req.body
  const response = await repository.update(id,data as MessageModel)
  responseApi(res, response);
});






export default router;