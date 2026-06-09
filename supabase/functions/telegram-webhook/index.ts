import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
try {
const update = await req.json();

```
const callback =
  update.callback_query;

if (!callback) {
  return new Response("ok");
}

const data =
  callback.data;

if (
  data.startsWith("paid_")
) {
  const orderId =
    Number(
      data.replace(
        "paid_",
        ""
      )
    );

  const supabase =
    createClient(
      Deno.env.get(
        "SUPABASE_URL"
      )!,
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY"
      )!
    );

  const now =
    new Date().toISOString();

  await supabase
    .from("orders")
    .update({
      payment_status:
        "paid",
      bill_status:
        "closed",
      status:
        "completed",
      paid_at: now,
      closed_at: now,
    })
    .eq("id", orderId);

  const token =
    Deno.env.get(
      "TELEGRAM_BOT_TOKEN"
    );

  await fetch(
    `https://api.telegram.org/bot${token}/answerCallbackQuery`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        callback_query_id:
          callback.id,
        text:
          "Оплата подтверждена",
      }),
    }
  );
}

return new Response("ok");
```

} catch (e) {
return new Response(
JSON.stringify({
error: e.message,
}),
{
status: 500,
}
);
}
});
