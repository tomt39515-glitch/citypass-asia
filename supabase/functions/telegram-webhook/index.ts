
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const update = await req.json();

    console.log(
      "UPDATE:",
      JSON.stringify(update, null, 2)
    );

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token =
      Deno.env.get("TELEGRAM_BOT_TOKEN");

    const allowedTransitions: Record<
      string,
      string
    > = {
      pending: "accepted",
      accepted: "preparing",
      preparing: "ready",
      ready: "completed",
    };

    async function getOrder(
      orderId: number
    ) {
      const { data, error } =
        await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .single();

      if (error) {
        throw error;
      }

      return data;
    }

    const message = update.message;

    if (message?.text) {
      const telegramId = String(
        message.from.id
      );

      const newTable =
        message.text.trim();

      const { data: session } =
        await supabase
          .from("telegram_sessions")
          .select("*")
          .eq(
            "telegram_id",
            telegramId
          )
          .eq(
            "action",
            "change_table"
          )
          .single();

      if (session) {
        const orderId =
          session.order_id;

        const order =
          await getOrder(orderId);

        const oldTable =
          order.current_table_number;

        const updateResult =
          await supabase
            .from("orders")
            .update({
              current_table_number:
                newTable,
            })
            .eq("id", orderId);

        if (updateResult.error) {
          console.error(
            updateResult.error
          );

          return new Response(
            "ok"
          );
        }

       await supabase
  .from("order_table_history")
  .insert({
    order_id: orderId,
    old_table_number: oldTable,
    new_table_number: newTable,
  });

        await supabase
          .from(
            "telegram_sessions"
          )
          .delete()
          .eq(
            "telegram_id",
            telegramId
          );

        await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              chat_id:
                telegramId,
              text: `✅ Столик изменён на ${newTable}`,
            }),
          }
        );

        return new Response("ok");
      }
    }

    const callback =
      update.callback_query;

    if (!callback) {
      return new Response("ok");
    }

    const data = callback.data;

    console.log(
      "CALLBACK DATA:",
      data
    );

    async function answer(
      text: string
    ) {
      const response =
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
              text,
            }),
          }
        );

      const result =
        await response.json();

      console.log(
        "TELEGRAM ANSWER:",
        JSON.stringify(result)
      );
    }

    async function changeStatus(
      orderId: number,
      nextStatus: string,
      successText: string
    ) {
      const order =
        await getOrder(orderId);

      const telegramId = String(
        callback.from.id
      );

      const { data: staff } =
        await supabase
          .from("partner_staff")
          .select("*")
          .eq(
            "telegram_id",
            telegramId
          )
          .eq(
            "active",
            true
          )
          .single();

      if (!staff) {
        await answer(
          "❌ Сотрудник не найден"
        );
        return false;
      }

      if (
        order.assigned_staff_id &&
        order.assigned_staff_id !==
          staff.id
      ) {
        await answer(
          "❌ Заказ закреплен за другим сотрудником"
        );
        return false;
      }

      const expectedStatus =
        allowedTransitions[
          order.status
        ];

      if (
        expectedStatus !==
        nextStatus
      ) {
        await answer(
          "❌ Неверный этап заказа"
        );
        return false;
      }

      const result =
        await supabase
          .from("orders")
          .update({
            status:
              nextStatus,
          })
          .eq("id", orderId)
          .select();

      if (result.error) {
        console.error(
          result.error
        );

        await answer(
          "❌ Ошибка обновления заказа"
        );

        return false;
      }

      console.log(
        "STATUS UPDATE:",
        JSON.stringify(result)
      );

      await answer(
        successText
      );

      return true;
    }

    if (
  data.startsWith(
    "accept_"
  )
) {
  const orderId =
    Number(
      data.replace(
        "accept_",
        ""
      )
    );

  const telegramId =
    String(
      callback.from.id
    );

  const { data: staff, error: staffError } =
  await supabase
    .from("partner_staff")
    .select("*")
    .eq("telegram_id", telegramId)
    .eq("active", true)
    .single();

console.log(
  "STAFF:",
  JSON.stringify(staff)
);

console.log(
  "STAFF ERROR:",
  JSON.stringify(staffError)
);

  if (!staff) {
    await answer(
      "❌ Сотрудник не найден"
    );

    return new Response(
      "ok"
    );
  }

  const order =
    await getOrder(orderId);

  if (
    order.assigned_staff_id
  ) {
    await answer(
      "❌ Заказ уже принят"
    );

    return new Response(
      "ok"
    );
  }

  const assignResult =
    await supabase
      .from("orders")
      .update({
        assigned_staff_id:
          staff.id,
      })
      .eq(
        "id",
        orderId
      )
      .is(
        "assigned_staff_id",
        null
      )
      .select();

  if (
    assignResult.error
  ) {
    console.error(
      assignResult.error
    );

    await answer(
      "❌ Ошибка назначения"
    );

    return new Response(
      "ok"
    );
  }

  const success =
    await changeStatus(
      orderId,
      "accepted",
      `Заказ принят: ${staff.full_name}`
    );

  if (!success) {
    return new Response(
      "ok"
    );
  }

  try {
    await fetch(
      `https://api.telegram.org/bot${token}/editMessageReplyMarkup`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          chat_id:
            callback.message.chat.id,
          message_id:
            callback.message.message_id,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: `👨‍🍳 ${staff.full_name}`,
                  callback_data:
                    "accepted",
                },
              ],
              [
                {
                  text:
                    "🍳 Готовится",
                  callback_data:
                    `prepare_${orderId}`,
                },
              ],
            ],
          },
        }),
      }
    );
  } catch (e) {
    console.error(
      "BUTTON UPDATE ERROR",
      e
    );
  }

  return new Response(
    "ok"
  );
}

    if (
      data.startsWith(
        "prepare_"
      )
    ) {
      const orderId =
        Number(
          data.replace(
            "prepare_",
            ""
          )
        );

      const success =
        await changeStatus(
          orderId,
          "preparing",
          "Заказ готовится"
        );

      if (success) {
        await fetch(
          `https://api.telegram.org/bot${token}/editMessageReplyMarkup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: callback.message.chat.id,
              message_id: callback.message.message_id,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "🍽 Заказ готов",
                      callback_data: `ready_${orderId}`,
                    },
                  ],
                  [
                    {
                      text: "✏️ Изменить стол",
                      callback_data: `table_${orderId}`,
                    },
                  ],
                  [
                    {
                      text: "💰 Подтвердить оплату",
                      callback_data: `paid_${orderId}`,
                    },
                  ],
                ],
              },
            }),
          }
        );
      }

      return new Response("ok");
    }

    if (
      data.startsWith(
        "ready_"
      )
    ) {
      const orderId =
        Number(
          data.replace(
            "ready_",
            ""
          )
        );

      const success =
        await changeStatus(
          orderId,
          "ready",
          "Заказ готов"
        );

      if (success) {
        await fetch(
          `https://api.telegram.org/bot${token}/editMessageReplyMarkup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: callback.message.chat.id,
              message_id: callback.message.message_id,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "✅ Выдан клиенту",
                      callback_data: `complete_${orderId}`,
                    },
                  ],
                  [
                    {
                      text: "✏️ Изменить стол",
                      callback_data: `table_${orderId}`,
                    },
                  ],
                  [
                    {
                      text: "💰 Подтвердить оплату",
                      callback_data: `paid_${orderId}`,
                    },
                  ],
                ],
              },
            }),
          }
        );
      }

      return new Response("ok");
    }

    if (
      data.startsWith(
        "complete_"
      )
    ) {
      const orderId =
        Number(
          data.replace(
            "complete_",
            ""
          )
        );

      const success =
        await changeStatus(
          orderId,
          "completed",
          "Заказ выдан клиенту"
        );

      if (success) {
        await fetch(
          `https://api.telegram.org/bot${token}/editMessageReplyMarkup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: callback.message.chat.id,
              message_id: callback.message.message_id,
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "✅ Выдан клиенту",
                      callback_data: "done",
                    },
                  ],
                  [
                    {
                      text: "💰 Оплата подтверждена",
                      callback_data: `paid_${orderId}`,
                    },
                  ],
                ],
              },
            }),
          }
        );
      }

      return new Response(
        "ok"
      );
    }

    if (
      data.startsWith(
        "table_"
      )
    ) {
      const orderId =
        Number(
          data.replace(
            "table_",
            ""
          )
        );

      const telegramId =
        String(
          callback.from.id
        );

      await supabase
        .from(
          "telegram_sessions"
        )
        .delete()
        .eq(
          "telegram_id",
          telegramId
        );

      const sessionResult =
        await supabase
          .from(
            "telegram_sessions"
          )
          .insert({
            telegram_id:
              telegramId,
            order_id:
              orderId,
            action:
              "change_table",
          });

      console.log(
        "TABLE SESSION:",
        JSON.stringify(
          sessionResult
        )
      );

      await answer(
        "Введите новый номер столика"
      );

      return new Response(
        "ok"
      );
    }

    if (
      data.startsWith(
        "paid_"
      )
    ) {
      const orderId =
        Number(
          data.replace(
            "paid_",
            ""
          )
        );

      const now =
        new Date().toISOString();

      const result =
        await supabase
          .from("orders")
          .update({
            payment_status:
              "paid",
            bill_status:
              "closed",
            paid_at: now,
            closed_at: now,
          })
          .eq("id", orderId)
          .select();

      if (result.error) {
        console.error(
          result.error
        );

        await answer(
          "❌ Ошибка подтверждения оплаты"
        );

        return new Response(
          "ok"
        );
      }

      console.log(
        "SUPABASE PAID:",
        JSON.stringify(result)
      );

      await answer(
        "Оплата подтверждена"
      );

      return new Response(
        "ok"
      );
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
          "Content-Type":
            "application/json",
        },
      }
    );
  }
});
