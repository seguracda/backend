import { Router, Request, Response } from "express";
import { responseApi } from "../../../functions/response.function";
import { StatisticsRepocitory } from "../data/statistics.repository";




const router = Router();
const repository = new StatisticsRepocitory()

router.get("/", async (req: Request, res: Response) => {
  const response = await repository.getAll()
  responseApi(res, response);
});








export default router;