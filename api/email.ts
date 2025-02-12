import { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const resend = new Resend(RESEND_API_KEY);
const MY_EMAIL = process.env.ADMIN_EMAIL || "aaronfebruary95@gmail.com";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: "Resend API key is not configured" });
  }

  try {
    const from = message.email;
    const to = MY_EMAIL;
    const subject = `Message to me from: ${message.name}`;
    const html = `Name: ${message.name}\nTel:${message.telephone}\n${message.message}`;

    resend.emails
      .send({
        from,
        to,
        subject,
        html,
      })
      .then((emailRes) => {
        res.status(200).json({ id: emailRes.data?.id });
      });
  } catch (error) {
    console.error("Error sending message to Resend:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
