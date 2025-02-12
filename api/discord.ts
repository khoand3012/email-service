import { VercelRequest, VercelResponse } from "@vercel/node";
const DISCORD_WEBHOOK_URL = `https://discord.com/api/webhooks/${process.env.DISCORD_WEBHOOK_ID}/${process.env.DISCORD_WEBHOOK_TOKEN}`;
import { allowCors } from "./allowCors";

async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!DISCORD_WEBHOOK_URL) {
    return res
      .status(500)
      .json({ error: "Discord Webhook URL is not configured" });
  }

  const { name, email, telephone, message } = req.body;

  try {
    const response = await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `Name: ${name}\nEmail: ${email}\nTel: ${telephone}\n${message}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send message to Discord");
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error sending message to Discord:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export default allowCors(handler);
