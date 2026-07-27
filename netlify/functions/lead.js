// Netlify serverless function: receives the lead form POST and forwards it
// to Pavel's Telegram bot as a message. The bot token and chat id are read
// from environment variables (set in Netlify site settings) — never hardcode
// secrets here, since this file is committed to a public-ish repo.

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!TOKEN || !CHAT_ID) {
    return { statusCode: 500, body: "Server not configured" };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: "Bad request" };
  }

  const name = (data.name || "").toString().slice(0, 200);
  const contact = (data.contact || "").toString().slice(0, 200);
  const message = (data.message || "").toString().slice(0, 1000);

  if (!name || !contact) {
    return { statusCode: 400, body: "Missing fields" };
  }

  const text =
    "🔔 Новая заявка с сайта\n\n" +
    `Имя: ${name}\n` +
    `Контакт: ${contact}\n` +
    (message ? `Сообщение: ${message}\n` : "");

  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text }),
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error("Telegram error:", errText);
      return { statusCode: 502, body: "Telegram send failed" };
    }
  } catch (err) {
    console.error(err);
    return { statusCode: 502, body: "Telegram send failed" };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ok: true }),
  };
};
