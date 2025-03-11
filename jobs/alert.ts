import IORedis from "ioredis";
import { Queue, Worker } from "bullmq";
import { sendEmail } from "../utils/email";
import { sendSlackNotification } from "../utils/slacknotif";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const alertsQueue = new Queue("alerts", { connection });

const worker = new Worker(
  "alerts",
  async (job) => {
    const alert = job.data;
    console.log("alert check");
    console.log(alert);
    if (alert.type == "WEBHOOK") {
    }
    if (alert.type == "EMAIL") {
      const res = await sendEmail({
        destination: alert.destination,
        subject: `Your CronJob ${alert.name} Is Down`,
        html: `<p>Your CronJob ${alert.name} is down!</p>`,
      });
      console.log("email res:", res);
      if (typeof res != "object") {
        console.log("email failed, adding to DLQ");
        // add to dlq
      }
    }
    if (alert.type == "WEBHOOK") {
      const res = await sendSlackNotification({
        destination: alert.destination,
        text: `Your CronJob ${alert.name} is down!`,
      });
    
    }
  },
  { connection }
);
