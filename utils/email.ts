import { Resend } from "resend";
const resendKey = process.env.RESEND_KEY
const resend = new Resend("re_S2xAyru1_Ks95ou2LpvFytE4FmofAXMQw");

type email = {
    destination: string,
    subject: string,
    html: string
}

export async function sendEmail(email: email) {
    const {data, error} = await resend.emails.send({
        from: "UptimeHQ <uptimehq@shivansh.space>",
        to: [email.destination],
        subject: email.subject,
        html: email.subject
    })
    if(error) {
        return error.message
    }
    return {data}
}