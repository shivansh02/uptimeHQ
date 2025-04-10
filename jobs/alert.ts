import IORedis from "ioredis";
import { Queue, Worker } from "bullmq";
import { sendEmail } from "../utils/email";
import { sendSlackNotification } from "../utils/slackNotif";
import { alertsDLQ } from "./alertDLQ";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const alertsQueue = new Queue("alerts", { connection });

const worker = new Worker(
  "alerts",
  async (job) => {
    const alert = job.data;
    console.log("Processing alert:", alert);

    if (alert.type === "EMAIL") {
      const res = await sendEmail({
        destination: alert.destination,
        subject: `Your CronJob ${alert.name} Is Down`,
        html: `<p>Your CronJob ${alert.name} is down!</p>`,
      });

      if (!res.success) {
        console.log("Email failed, adding to DLQ:", res.message);
        await alertsDLQ.add("alertsDLQ", alert);
      }
    }

    if (alert.type === "WEBHOOK") {
      const res = await sendSlackNotification({
        destination: alert.destination,
        text: `Your CronJob ${alert.name} is down!`,
      });

      if (!res.success) {
        console.log("Slack notification failed, adding to DLQ:", res.message);
        await alertsDLQ.add("alertsDLQ", alert);
      }
    }
  },
  { connection }
);
