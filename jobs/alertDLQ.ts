import IORedis from "ioredis";
import { Queue, Worker } from "bullmq";
import { sendEmail } from "../utils/email";
import { sendSlackNotification } from "../utils/slackNotif";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const alertsDLQ = new Queue("alertsDLQ", { connection });

const worker = new Worker(
  "alertsDLQ",
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
        console.log("Email retry failed:", res.message);
      }
    }

    if (alert.type === "WEBHOOK") {
      const res = await sendSlackNotification({
        destination: alert.destination,
        text: `Your CronJob ${alert.name} is down!`,
      });

      if (!res.success) {
        console.log("Slack notification retry failed: ", res.message);
      }
    }
  },
  { connection }
);
