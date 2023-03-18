import { Router, Request, Response } from "express";
import { responseApi } from "../../../functions/response.function";
import { UserRepository } from "../data/user.repository";
import { LoginResquest } from "../interfaces/loginrequest.interface";
import { UserModel } from "../models/user.model";


const router = Router();
const repository = new UserRepository()

router.get("/", async (req: Request, res: Response) => {
  const response = await repository.getAll()
  responseApi(res, response);
});

router.post("/", async (req: Request, res: Response) => {
  const user = req.body as UserModel
  const response = await repository.create(user)
  responseApi(res, response);
});

router.post("/login", async (req: Request, res: Response) => {
  const data = req.body as LoginResquest
  const response = await repository.login(data)
  responseApi(res, response);
});



export default router;
