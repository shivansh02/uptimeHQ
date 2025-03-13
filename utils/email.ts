import { Resend } from "resend";

const resendKey = process.env.RESEND_KEY;
const resend = new Resend(resendKey);

type EmailParams = {
  destination: string;
  subject: string;
  html: string;
};

export async function sendEmail(
  email: EmailParams
): Promise<{ success: boolean; message: string }> {
  try {
    const { data, error } = await resend.emails.send({
      from: "UptimeHQ <uptimehq@shivansh.space>",
      to: [email.destination],
      subject: email.subject,
      html: email.html,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: "Email sent successfully" };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}
