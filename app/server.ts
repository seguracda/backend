import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

import fileUpload from "express-fileupload";
import cors from "cors";
import { expressjwt } from "express-jwt";
import fs from "fs";

export class Servidor {
  app: Application;


  constructor(private port?: number | string) {
    this.app = express();
    this.app.set("port", this.port || process.env.PORT || 3000);
    this.middlewares();
    this.routes();
  }

  middlewares(): void {
    this.app.use(express.static(__dirname + "/public"));
    this.app.use(cors());
    this.app.use(fileUpload());
    this.app.use(express.json());
   /*  this.app.use(
      expressjwt({
        secret: process.env.SECRET_TOKEN as string,
        requestProperty: "token",
        algorithms: ["HS256"],
      }).unless({
        path: ["/usuarios/login"],
      })
    ); */
    this.app.use(
      (
        err: ErrorRequestHandler,
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (err.name === "UnauthorizedError") {
          res.status(401).send("Unauthorized");
        }
      }
    );
  }

  routes(): void {
    const routes = this.getRoutes();
    routes.forEach(async (route) => {
      try {
        const patch = await import(`./src/${route}/api/${route}.api`);
        this.app.use(`/api/v1/${route}`, patch.default);
      } catch (error) {
        console.error(`Not exist file api for ${route}`);
      }
    });
  }

  private getRoutes() {
    return fs.readdirSync(`${__dirname}/src`);
  }

  async listen(): Promise<void> {
    await this.app.listen(this.app.get("port"));
    console.log("Server Ready", this.app.get("port"));
  }
}
