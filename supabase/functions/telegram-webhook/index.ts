import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
try {
const update = await req.json();


console.log(
  "UPDATE:",
  JSON.stringify(update, null, 2)
);

const callback = update.callback_query;

if (!callback) {
  return new Response("ok");
}

const data = callback.data;

console.log("CALLBACK DATA:", data);

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const token =
  Deno.env.get("TELEGRAM_BOT_TOKEN");
const allowedTransitions: Record<string, string> = {
  pending: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "completed",
};

async function getOrder(orderId: number) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

async function changeStatus(
  orderId: number,
  nextStatus: string,
  successText: string
) {
  const order = await getOrder(orderId);

  const expectedStatus =
    allowedTransitions[order.status];

  if (expectedStatus !== nextStatus) {
    await answer("❌ Неверный этап заказа");
    return false;
  }

  const result = await supabase
  .from("orders")
  .update({
    status: nextStatus,
  })
  .eq("id", orderId)
  .select();

if (result.error) {
  console.error(result.error);
  await answer("❌ Ошибка обновления заказа");
  return false;
}

  console.log(
    "STATUS UPDATE:",
    JSON.stringify(result)
  );

  await answer(successText);

  return true;
}
async function answer(text: string) {
  const response = await fetch(
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

  const result = await response.json();

  console.log(
    "TELEGRAM ANSWER:",
    JSON.stringify(result)
  );
}

if (data.startsWith("accept_")) {
  const orderId = Number(
    data.replace("accept_", "")
  );

  console.log("ACCEPT ORDER:", orderId);

  await changeStatus(
    orderId,
    "accepted",
    "Заказ принят"
  );

  return new Response("ok");
}

if (data.startsWith("prepare_")) {
  const orderId = Number(
    data.replace("prepare_", "")
  );

  console.log("PREPARE ORDER:", orderId);

  await changeStatus(
    orderId,
    "preparing",
    "Заказ готовится"
  );

  return new Response("ok");
}

if (data.startsWith("ready_")) {
  const orderId = Number(
    data.replace("ready_", "")
  );

  console.log("READY ORDER:", orderId);

  await changeStatus(
    orderId,
    "ready",
    "Заказ готов"
  );

  return new Response("ok");
}

if (data.startsWith("complete_")) {
  const orderId = Number(
    data.replace("complete_", "")
  );

  console.log("COMPLETE ORDER:", orderId);

  await changeStatus(
    orderId,
    "completed",
    "Заказ выдан клиенту"
  );

  return new Response("ok");
}
if (data.startsWith("table_")) {
  const orderId = Number(
    data.replace("table_", "")
  );

  const telegramId =
    String(callback.from.id);

  await supabase
    .from("telegram_sessions")
    .delete()
    .eq("telegram_id", telegramId);

  const sessionResult =
    await supabase
      .from("telegram_sessions")
      .insert({
        telegram_id: telegramId,
        order_id: orderId,
        action: "change_table",
      });

  console.log(
    "TABLE SESSION:",
    JSON.stringify(sessionResult)
  );

  await answer(
    "Введите новый номер столика"
  );

  return new Response("ok");
}
if (data.startsWith("paid_")) {
  const orderId = Number(
    data.replace("paid_", "")
  );

  const now =
    new Date().toISOString();

  console.log("PAID ORDER:", orderId);

  const result = await supabase
    .from("orders")
    .update({
  payment_status: "paid",
  bill_status: "closed",
  paid_at: now,
  closed_at: now,
})
    .eq("id", orderId)
    .select();
if (result.error) {
  console.error(result.error);

  await answer(
    "❌ Ошибка подтверждения оплаты"
  );

  return new Response("ok");
}
  console.log(
    "SUPABASE PAID:",
    JSON.stringify(result)
  );

  await answer("Оплата подтверждена");

  return new Response("ok");
}

return new Response("ok");


} catch (e) {
console.error(
"WEBHOOK ERROR:",
e
);


return new Response(
  JSON.stringify({
    error: String(e),
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
