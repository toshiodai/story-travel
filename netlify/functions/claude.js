// netlify/functions/claude.js
exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  console.log("API key present:", !!apiKey, "length:", apiKey ? apiKey.length : 0);

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "サーバーにANTHROPIC_API_KEYが設定されていません。",
      }),
    };
  }

  try {
    const incoming = JSON.parse(event.body || "{}");
    const allowedModels = ["claude-sonnet-4-6"];
    const model = allowedModels.includes(incoming.model) ? incoming.model : "claude-sonnet-4-6";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: incoming.max_tokens || 1024,
        messages: incoming.messages || [],
      }),
    });

    const data = await response.text();
    console.log("Anthropic status:", response.status);
    console.log("Anthropic body:", data.slice(0, 500));

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: data,
    };
  } catch (err) {
    console.log("Function error:", String(err));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
