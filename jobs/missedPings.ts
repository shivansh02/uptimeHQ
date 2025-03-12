import { Worker, Queue } from "bullmq";
import cronParser from "cron-parser";
import dayjs from "dayjs";
import IORedis from "ioredis";
import prisma from "../prisma/client";
import { alertsQueue } from "./alert";

const queueName = "check-missed-pings";
const connection = new IORedis({ maxRetriesPerRequest: null });

const queue = new Queue(queueName, { connection });

const worker = new Worker(
  queueName,
  async () => {
    console.log("Checking for missed pings...");

    const now = new Date();

    const jobs = await prisma.job.findMany({
      // where: { status: "UP" },
    });

    for (const job of jobs) {
      if (!job.cronSchedule) continue;

      try {
        const interval = cronParser.parseExpression(job.cronSchedule, {
          utc: true,
        });

        const lastExpectedRun = interval.prev().toDate();
        const graceTime = dayjs(lastExpectedRun)
          .add(job.gracePeriod, "seconds")
          .toDate();

        // if last expected run + grace period has passed without a ping, mark as DOWN
        if (!job.lastPing || new Date(job.lastPing) < graceTime) {
          await prisma.job.update({
            where: { id: job.id },
            data: {
              status: "DOWN",
              missedPingCount: {
                increment: 1,
              },
            },
          });

          console.log(`Job ${job.id} marked as DOWN`);

          // add to alert queue
          const alertTypes = await prisma.alert.findMany({
            where: { jobId: job.id },
          });

          for (const alert of alertTypes) {
            console.log("Adding alert:", { name: job.name, ...alert });
            await alertsQueue.add("alert", { name: job.name, ...alert });
          }
        }
      } catch (error) {
        console.error(`Invalid cron schedule for job ${job.id}:`, error);
      }
    }
  },
  { connection, removeOnComplete: { age: 3600 }, removeOnFail: { age: 3600 } }
);

async function scheduleWorker() {
  const repeatableJobs = await queue.getJobSchedulers();
  // const repeatableJobs2 = await
  console.log("jobs: ", repeatableJobs);
  if ((repeatableJobs.length == 0)) {
    console.log("added job")
    await queue.add(queueName, {}, { repeat: { pattern: "*/1 * * * *" } });
  }
}

export async function startMissedPingWorker() {
  await scheduleWorker();
}
