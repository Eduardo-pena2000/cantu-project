import { ICronJob } from "../../../infraestructure";

import { makeDeleteReadNotifications } from "./delete-read-notifications.factory";

export class CronJobsFactory {
  createJobs(): ICronJob[] {
    return [this.deleteReadNotifications()];
  }

  private deleteReadNotifications(): ICronJob {
    return {
      name: "daily-cleanup",
      schedule: "0 0 * * *",
      task: async () => {
        await makeDeleteReadNotifications().execute();
      },
      enabled: true,
    };
  }
}
