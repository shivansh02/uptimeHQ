import { Queue, Worker } from "bullmq";
import dayjs from "dayjs";
import IORedis from "ioredis";
import prisma from "../prisma/client";
import { alertsQueue } from "./alert";

const queueName = "check-missed-pings";

const connection = new IORedis({maxRetriesPerRequest: null})

const queue = new Queue(queueName, {connection});

// Worker to process jobs
const worker = new Worker(
  queueName,
  async () => {
    console.log("Checking for missed pings...");

    const now = new Date();
    const jobs = await prisma.job.findMany({
      where: {
        status: "UP",
      },
    });

    for (const job of jobs) {
      const expectedTime = dayjs(job.lastPing || job.createdAt)
        .add(job.interval + job.gracePeriod, "seconds")
        .toDate();

      if (now > expectedTime) {
        await prisma.job.update({
          where: { id: job.id },
          data: { status: "DOWN" },
        });
        console.log(`Job ${job.id} marked as DOWN`);

        const alertTypes = await prisma.alert.findMany({
          where : {
            jobId: job.id
          }
        })
        console.log("alerts found", alertTypes)

        for(const alert of alertTypes) {
          console.log("added", {name: job.name, ...alert})
          await alertsQueue.add("alert", {name: job.name, ...alert})
        }

        // await alertsQueue.add("alert", {jobId: job.id, name: job.name})
      }
    }
  },
  { connection }
);

// run every 10 seconds
async function scheduleJob() {
  await queue.add(queueName, {}, { repeat: { every: 60000 } });
}

export async function startMissedPingWorker() {
  await scheduleJob();
}
 