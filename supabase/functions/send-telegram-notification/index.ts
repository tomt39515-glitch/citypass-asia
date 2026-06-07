Deno.serve(async (req) => {
  try {
    const token = Deno.env.get("TELEGRAM_BOT_TOKEN");

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: "8052071718",
          text: "✅ CityPass Asia Telegram уведомления работают",
        }),
      }
    );

    const result = await response.json();

    return new Response(
      JSON.stringify(result),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        error: e.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
});