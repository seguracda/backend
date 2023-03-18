import { Router, Request, Response } from "express";
import { FileArray } from "express-fileupload";
import { responseApi } from "../../../functions/response.function";
import { StatisticsRepocitory } from "../../statistics/data/statistics.repository";
import { ClientRepository } from "../data/clients.repository";


const router = Router();
const repository = new ClientRepository(new StatisticsRepocitory())

router.get("/", async (req: Request, res: Response) => {
  const page = req.query.page as string;
  const response = await repository.getClientByPage(+page)
  responseApi(res, response);
});


router.get("/", async (req: Request, res: Response) => {
  const response = await repository.getAll()
  responseApi(res, response);
});

router.get("/search/:text", async (req: Request, res: Response) => {
  const text = req.params.text;
  const page = req.query.page as string
  const response = await repository.getClientsByText(text,+page)
  responseApi(res, response);
});

router.post("/database/excel", async (req: Request, res: Response) => {
  const files = req.files as FileArray
  const response = await repository.createClientToExcel(files)
  responseApi(res, response);
});

router.put("/", async (req: Request, res: Response) => {
  const {id,...data} = req.body
  const response = await repository.update(id,data)
  responseApi(res, response);
});



export default router;