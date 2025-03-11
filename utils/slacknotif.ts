import axios from "axios";

type SlackNotification = {
  destination: string;
  text: string;
};

export async function sendSlackNotification(notif: SlackNotification): Promise<void> {
  try {
    const response = await axios.post(notif.destination, { text: notif.text });
    console.log("Slack notification sent:", response.data);
  } catch (error) {
    console.error("Error sending Slack notification:", error);
  }
}
