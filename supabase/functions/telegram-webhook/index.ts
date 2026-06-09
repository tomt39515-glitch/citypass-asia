import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
try {
const update = await req.json();


const callback = update.callback_query;

if (!callback) {
  return new Response("ok");
}

const data = callback.data;

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const token =
  Deno.env.get("TELEGRAM_BOT_TOKEN");

async function answer(text) {
  await fetch(
    `https://api.telegram.org/bot${token}/answerCallbackQuery`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        callback_query_id: callback.id,
        text,
      }),
    }
  );
}

if (data.startsWith("accept_")) {
  const orderId = Number(
    data.replace("accept_", "")
  );

  await supabase
    .from("orders")
    .update({
      status: "accepted",
    })
    .eq("id", orderId);

  await answer("Заказ принят");

  return new Response("ok");
}

if (data.startsWith("prepare_")) {
  const orderId = Number(
    data.replace("prepare_", "")
  );

  await supabase
    .from("orders")
    .update({
      status: "preparing",
    })
    .eq("id", orderId);

  await answer("Заказ готовится");

  return new Response("ok");
}

if (data.startsWith("ready_")) {
  const orderId = Number(
    data.replace("ready_", "")
  );

  await supabase
    .from("orders")
    .update({
      status: "ready",
    })
    .eq("id", orderId);

  await answer("Заказ готов");

  return new Response("ok");
}

if (data.startsWith("complete_")) {
  const orderId = Number(
    data.replace("complete_", "")
  );

  await supabase
    .from("orders")
    .update({
      status: "completed",
    })
    .eq("id", orderId);

  await answer("Заказ выдан клиенту");

  return new Response("ok");
}

if (data.startsWith("paid_")) {
  const orderId = Number(
    data.replace("paid_", "")
  );

  const now =
    new Date().toISOString();

  await supabase
    .from("orders")
    .update({
      payment_status: "paid",
      bill_status: "closed",
      status: "completed",
      paid_at: now,
      closed_at: now,
    })
    .eq("id", orderId);

  await answer("Оплата подтверждена");

  return new Response("ok");
}

return new Response("ok");


} catch (e) {
return new Response(
JSON.stringify({
error: String(e),
}),
{
status: 500,
}
);
}
});
