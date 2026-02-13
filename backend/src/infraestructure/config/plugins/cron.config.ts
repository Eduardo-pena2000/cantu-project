import cron, { ScheduledTask } from "node-cron";

import { CronJobsFactory } from "../../../application";

export interface CronJob {
  name: string;
  schedule: string;
  task: () => Promise<void>;
}

export interface ICronJob {
  name: string;
  schedule: string;
  task: () => Promise<void>;
  enabled?: boolean;
}

interface ICronManager {
  addJob(job: ICronJob): void;
  startAll(): void;
}

export class CronManager implements ICronManager {
  private jobs: Map<string, ScheduledTask> = new Map();

  addJob(job: ICronJob): void {
    try {
      if (this.jobs.has(job.name)) return;

      const scheduledTask = cron.schedule(job.schedule, async () => {
        const startTime = Date.now();

        try {
          await job.task();
        } catch (error) {
          console.error(`Error in job "${job.name}":`, error);
        }
      });

      this.jobs.set(job.name, scheduledTask);
    } catch (error) {
      console.error(`Error adding job ${job.name}:`, error);
    }
  }

  startAll(): void {
    this.jobs.forEach((job) => {
      job.start();
    });

    console.log(`Server crontab running.`);
  }
}

export const initializeCronServer = (): CronManager => {
  const cronManager = new CronManager();

  const jobsFactory = new CronJobsFactory();

  const jobs = jobsFactory.createJobs();

  jobs.forEach((job) => {
    cronManager.addJob(job);
  });

  cronManager.startAll();

  return cronManager;
};
