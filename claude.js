// netlify/functions/claude.js
// ブラウザから直接Anthropic APIキーを送らず、このサーバーレス関数を経由して
// 安全にAPIを呼び出すためのプロキシです。
// APIキーは Netlify の環境変数 ANTHROPIC_API_KEY に設定してください（コードには書きません）。

exports.handler = async function (event) {
  // CORS preflight (同一オリジンなら通常不要ですが念のため)
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
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "サーバーにANTHROPIC_API_KEYが設定されていません。Netlifyの環境変数を確認してください。",
      }),
    };
  }

  try {
    const incoming = JSON.parse(event.body || "{}");

    // 呼び出せるモデルを限定（悪用防止の簡易チェック）
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

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: data,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
