import axios from "axios";

type SlackNotification = {
  destination: string;
  text: string;
};

export async function sendSlackNotification(
  notif: SlackNotification
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await axios.post(notif.destination, { text: notif.text });

    if (response.status >= 200 && response.status < 300) {
      return { success: true, message: "Slack notification sent successfully" };
    } else {
      return { success: false, message: `Slack API error: ${response.statusText}` };
    }
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
