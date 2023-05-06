import schedule, { Job } from "node-schedule";
import { EnvSms } from "../env";
import { ClientRepository } from "../src/clients/data/clients.repository";
import { StatisticsRepocitory } from "../src/statistics/data/statistics.repository";

export class JobShedule {
  static runJob() {
    return schedule.scheduleJob("0 8 * * *", async function () {
      const repository = new ClientRepository(new StatisticsRepocitory());
      repository.sendMessageExpired();
    });
  }
}
