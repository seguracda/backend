import { JobShedule } from "./class/jobs.class";
import { DataBase } from "./database";
import { EnvDataBase } from "./env";
import { Servidor } from "./server";


async function main() {
  const app = new Servidor();
  await app.listen();
  await DataBase.initDataBase(EnvDataBase.URL_MONGO);
  JobShedule.runJob();
  
}

main();
