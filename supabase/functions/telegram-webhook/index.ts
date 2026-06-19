
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
async function getTranslation(
  templateKey: string,
  languageCode = "en"
) {
  const { data } = await supabase
    .from("notification_templates")
    .select("message")
    .eq("template_key", templateKey)
    .eq("language_code", languageCode)
    .maybeSingle();

  return data?.message || templateKey;
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

     const { data: client } =
  await supabase
    .from("clients")
    .select("telegram_id, preferred_language")
    .eq("id", order.client_id)
    .single();

const lang =
  client?.preferred_language || "en";

const templateKey =
  `order_${nextStatus}`;

const { data: template } =
  await supabase
    .from("notification_templates")
    .select("message")
    .eq("template_key", templateKey)
    .eq("language_code", lang)
    .maybeSingle();

const statusMessage =
  template?.message ||
  "Order status updated";

      if (client?.telegram_id) {
        try {
          const tgResponse =
            await fetch(
              `https://api.telegram.org/bot${token}/sendMessage`,
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  chat_id: Number(
                    client.telegram_id
                  ),
                  text:
                    `${statusMessage}\n\nOrder #${order.order_number}`,
                }),
              }
            );

          const tgResult =
            await tgResponse.json();

          console.log(
            "CLIENT TELEGRAM RESULT:",
            JSON.stringify(
              tgResult
            )
          );
        } catch (e) {
          console.error(
            "CLIENT TELEGRAM ERROR:",
            e
          );
        }
      }

      await answer(
        successText
      );

      return true;
    }

    
// ===== ADDON ORDER FLOW =====

if (data.startsWith("accept_addon_")) {
  const orderId = Number(data.replace("accept_addon_", ""));
const order = await getOrder(orderId);

const { data: partner } =
  await supabase
    .from("partners")
    .select("preferred_language")
    .eq("id", order.partner_id)
    .single();

const partnerLang =
  partner?.preferred_language || "en";

const preparingButton =
  await getTranslation(
    "preparing_button",
    partnerLang
  );
  const telegramId = String(callback.from.id);

  const { data: staff } = await supabase
    .from("partner_staff")
    .select("*")
    .eq("telegram_id", telegramId)
    .eq("active", true)
    .single();

  if (!staff) {
    await answer("❌ Сотрудник не найден");
    return new Response("ok");
  }

  await answer("Дозаказ принят");

  await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: callback.message.chat.id,
      message_id: callback.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: `👨‍🍳 ${staff.full_name}`, callback_data: "addon_accepted" }],
         [
  {
    text: preparingButton,
    callback_data: `addon_prepare_${orderId}`,
  },
]
        ]
      }
    })
  });

  return new Response("ok");
}

if (data.startsWith("addon_prepare_")) {
  const orderId = Number(data.replace("addon_prepare_", ""));

  await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: callback.message.chat.id,
      message_id: callback.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "🍽 Заказ готов", callback_data: `addon_ready_${orderId}` }]
        ]
      }
    })
  });

  return new Response("ok");
}

if (data.startsWith("addon_ready_")) {
  const orderId = Number(data.replace("addon_ready_", ""));

  await fetch(`https://api.telegram.org/bot${token}/editMessageReplyMarkup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: callback.message.chat.id,
      message_id: callback.message.message_id,
      reply_markup: {
        inline_keyboard: [
          [{ text: "✅ Выдать клиенту", callback_data: `addon_serve_${orderId}` }]
        ]
      }
    })
  });

  return new Response("ok");
}

if (data.startsWith("addon_serve_")) {
  const orderId = Number(
    data.replace("addon_serve_", "")
  );

  const order = await getOrder(orderId);

  const { data: partner } =
    await supabase
      .from("partners")
      .select("preferred_language")
      .eq("id", order.partner_id)
      .single();

  const partnerLang =
    partner?.preferred_language || "en";

  const completedButton =
    await getTranslation(
      "completed_button",
      partnerLang
    );

  await fetch(
    `https://api.telegram.org/bot${token}/editMessageReplyMarkup`,
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        chat_id: callback.message.chat.id,
        message_id: callback.message.message_id,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: completedButton,
                callback_data: "done",
              },
            ],
          ],
        },
      }),
    }
  );

  return new Response("ok");
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
const { data: partner } =
  await supabase
    .from("partners")
    .select("preferred_language")
    .eq("id", order.partner_id)
    .single();

const partnerLang =
  partner?.preferred_language || "en";

const preparingButton =
  await getTranslation(
    "preparing_button",
    partnerLang
  );

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
  text: preparingButton,
  callback_data: `prepare_${orderId}`,
}
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

    if (data.startsWith("prepare_")) {
      const orderId = Number(
        data.replace("prepare_", "")
      );

      const order = await getOrder(orderId);

      const { data: partner } =
        await supabase
          .from("partners")
          .select("preferred_language")
          .eq("id", order.partner_id)
          .single();

      const partnerLang =
        partner?.preferred_language || "en";

      const readyButton =
        await getTranslation(
          "ready_button",
          partnerLang
        );

      const paymentButton =
        await getTranslation(
          "payment_button",
          partnerLang
        );

      const changeTableButton =
        await getTranslation(
          "change_table_button",
          partnerLang
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
                      text: readyButton,
                      callback_data: `ready_${orderId}`,
                    },
                  ],
                  [
                    {
                      text: changeTableButton,
                      callback_data: `table_${orderId}`,
                    },
                  ],
                  [
                    {
                      text: paymentButton,
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

    if (data.startsWith("ready_")) {
      const orderId = Number(
        data.replace("ready_", "")
      );

      const order = await getOrder(orderId);

      const { data: partner } =
        await supabase
          .from("partners")
          .select("preferred_language")
          .eq("id", order.partner_id)
          .single();

      const partnerLang =
        partner?.preferred_language || "en";

      const serveButton =
        await getTranslation(
          "serve_button",
          partnerLang
        );

      const paymentButton =
        await getTranslation(
          "payment_button",
          partnerLang
        );

      const changeTableButton =
        await getTranslation(
          "change_table_button",
          partnerLang
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
                      text: serveButton,
                      callback_data: `serve_${orderId}`,
                    },
                  ],
                  [
                    {
                      text: changeTableButton,
                      callback_data: `table_${orderId}`,
                    },
                  ],
                  [
                    {
                      text: paymentButton,
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
        "serve_"
      )
    ) {
      const orderId =
        Number(
          data.replace(
            "serve_",
            ""
          )
        );
const order = await getOrder(orderId);

const { data: partner } =
  await supabase
    .from("partners")
    .select("preferred_language")
    .eq("id", order.partner_id)
    .single();

const partnerLang =
  partner?.preferred_language || "en";
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
                      text: await getTranslation("completed_button", partnerLang),
                      callback_data: "done",
                    },
                  ],
                  [
                    {
                      text: await getTranslation("payment_button", partnerLang),
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

  

   if (data.startsWith("paid_")) {
  const orderId = Number(
    data.replace("paid_", "")
  );
const order =
  await getOrder(orderId);

const { data: partner } =
  await supabase
    .from("partners")
    .select("preferred_language")
    .eq("id", order.partner_id)
    .single();

const partnerLang =
  partner?.preferred_language || "en";

const cashButton =
  await getTranslation(
    "cash_button",
    partnerLang
  );

const cardButton =
  await getTranslation(
    "card_button",
    partnerLang
  );

const qrButton =
  await getTranslation(
    "qr_button",
    partnerLang
  );
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
                text: cashButton,
                callback_data: `payment_cash_${orderId}`,
              },
            ],
            [
              {
                text: cardButton,
                callback_data: `payment_card_${orderId}`,
              },
            ],
            [
              {text: qrButton,
                callback_data: `payment_qr_${orderId}`,
              },
            ],
          ],
        },
      }),
    }
  );

 const choosePaymentText =
  await getTranslation(
    "choose_payment_method",
    partnerLang
  );

await answer(
  choosePaymentText
);

  return new Response("ok");
}
if (
  data.startsWith("payment_cash_") ||
  data.startsWith("payment_card_") ||
  data.startsWith("payment_qr_")
) {
  let paymentMethod = "";

  if (data.startsWith("payment_cash_")) {
    paymentMethod = "cash";
  }

  if (data.startsWith("payment_card_")) {
    paymentMethod = "card";
  }

  if (data.startsWith("payment_qr_")) {
    paymentMethod = "qr";
  }

  const orderId = Number(
    data.split("_").pop()
  );

  const order =
    await getOrder(orderId);

  await supabase
    .from("orders")
    .update({
      payment_method:
        paymentMethod,
    })
    .eq("id", orderId);

 const { data: partner } =
  await supabase
    .from("partners")
    .select("preferred_language")
    .eq("id", order.partner_id)
    .single();

const partnerLang =
  partner?.preferred_language || "en";

const cashButton =
  await getTranslation(
    "cash_button",
    partnerLang
  );

const cardButton =
  await getTranslation(
    "card_button",
    partnerLang
  );

const qrButton =
  await getTranslation(
    "qr_button",
    partnerLang
  );

const paymentReceivedButton =
  await getTranslation(
    "payment_received_button",
    partnerLang
  );

const cancelButton =
  await getTranslation(
    "cancel_button",
    partnerLang
  );


const methodText =
  paymentMethod === "cash"
    ? cashButton
    : paymentMethod === "card"
    ? cardButton
    : qrButton;

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
                text: paymentReceivedButton,
                callback_data:
                  `confirm_payment_${orderId}`,
              },
            ],
            [
              {
                text: cancelButton,
                callback_data:
                  `cancel_payment_${orderId}`,
              },
            ],
          ],
        },
      }),
    }
  );

  await answer(
    `${methodText}. Сумма: ${
      order.total_amount || 0
    }`
  );

  return new Response("ok");
}

if (
  data.startsWith(
    "confirm_payment_"
  )
) {
  const orderId = Number(
    data.replace(
      "confirm_payment_",
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
      .eq("id", orderId);

  if (result.error) {
    console.error(
      result.error
    );

    await answer(
      "❌ Ошибка оплаты"
    );

    return new Response(
      "ok"
    );
  }
const order =
  await getOrder(orderId);

const { data: partner } =
  await supabase
    .from("partners")
    .select("preferred_language")
    .eq("id", order.partner_id)
    .single();

const partnerLang =
  partner?.preferred_language || "en";

const billClosedButton =
  await getTranslation(
    "bill_closed_button",
    partnerLang
  );
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
                text:
  billClosedButton,
                callback_data:
                  "done",
              },
            ],
          ],
        },
      }),
    }
  );

 

  const { data: client } =
    await supabase
      .from("clients")
      .select("telegram_id, preferred_language")
      .eq("id", order.client_id)
      .single();
const { data: paymentTemplate } =
  await supabase
    .from("notification_templates")
    .select("message")
    .eq(
      "template_key",
      "payment_confirmed"
    )
    .eq(
      "language_code",
      client?.preferred_language || "en"
    )
    .maybeSingle();

const paymentText =
  paymentTemplate?.message ||
  "Payment confirmed";
  if (client?.telegram_id) {
    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: Number(client.telegram_id),
         text:
`${paymentText}

Order #${order.order_number}

Amount: ${order.total_amount || 0} ₫`,
        }),
      }
    );
  }

  await answer(
    "Оплата подтверждена"
  );

  return new Response("ok");
}
if (
  data.startsWith(
    "cancel_payment_"
  )
) {
  await answer(
    "Оплата отменена"
  );

  return new Response(
    "ok"
  );
}

    // ===============================
// CITYPASS ASIA TABLE SESSION PATCH
// Добавить перед return new Response("ok"); в обработке callback
// ===============================

    if (data.startsWith("joinapprove_")) {
      const requestId = Number(data.replace("joinapprove_", ""));

      const { data: joinRequest } = await supabase
        .from("table_join_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (!joinRequest) {
        await answer("Заявка не найдена");
        return new Response("ok");
      }

    const { data: existingMember } =
  await supabase
    .from("table_session_members")
    .select("*")
    .eq(
      "table_session_id",
      joinRequest.table_session_id
    )
    .eq(
      "client_id",
      joinRequest.client_id
    )
    .maybeSingle();

if (!existingMember) {
  await supabase
    .from("table_session_members")
    .insert({
      table_session_id:
        joinRequest.table_session_id,
      client_id:
        joinRequest.client_id,
    });
}

      await supabase
        .from("table_join_requests")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
        })
        .eq("id", requestId);

      const { data: pendingOrder } = await supabase
        .from("pending_join_orders")
        .select("*")
        .eq("table_join_request_id", requestId)
        .maybeSingle();

      if (pendingOrder) {

       const { data: existingOrders } = await supabase
  .from("orders")
  .select("*")
  .eq("partner_id", pendingOrder.partner_id)
  .eq("bill_status", "open")
  .order("created_at", { ascending: false });

const existingOrder =
  existingOrders?.find(
    (o) =>
      String(o.current_table_number) ===
        String(pendingOrder.table_number) ||
      String(o.table_number) ===
        String(pendingOrder.table_number)
  ) || existingOrders?.[0] || null;
console.log(
  "PENDING ORDER",
  JSON.stringify(pendingOrder)
);

console.log(
  "FOUND ORDER",
  JSON.stringify(existingOrder)
);

        if (existingOrder) {

          await supabase
            .from("order_items")
            .insert(
              (pendingOrder.cart || []).map((item: any) => ({
                order_id: existingOrder.id,
                item_id: item.id,
                item_name_snapshot: item.name,
                unit_price: item.price || 0,
                quantity: item.quantity || 1,
                total_price: (item.price || 0) * (item.quantity || 1),
              }))
            );

          await supabase
            .from("orders")
            .update({
              subtotal: Number(existingOrder.subtotal || 0) + Number(pendingOrder.subtotal || 0),
              discount_amount: Number(existingOrder.discount_amount || 0) + Number(pendingOrder.discount_amount || 0),
              total_amount: Number(existingOrder.total_amount || 0) + Number(pendingOrder.total_amount || 0),
            })
            .eq("id", existingOrder.id);
        }
const orderText = (pendingOrder.cart || [])
  .map(
    (item: any) =>
      `• ${item.name} x${item.quantity || 1}`
  )
  .join("\n");

const { data: addonPartner } =
  await supabase
    .from("partners")
    .select("preferred_language")
    .eq("id", pendingOrder.partner_id)
    .single();

const addonLang =
  addonPartner?.preferred_language || "en";

const acceptButton =
  await getTranslation(
    "accept_button",
    addonLang
  );

const messageText =
  `🆕 ДОЗАКАЗ К СТОЛУ ${pendingOrder.table_number}\n\n` +
  orderText +
  `\n\n💰 Сумма: ${pendingOrder.total_amount || 0}`;

await fetch(
  `https://api.telegram.org/bot${token}/sendMessage`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: callback.message.chat.id,
      text: messageText,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: acceptButton,
              callback_data: `accept_addon_${existingOrder.id}`,
            },
          ],
        ],
      },
    }),
  }
);

console.log(
  "DOORDER SENT",
  callback.message.chat.id
);
        await supabase
          .from("pending_join_orders")
          .delete()
          .eq("id", pendingOrder.id);
      }

      await answer("Гость подключён к столу");
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
              text: "👥 Клиент присоединён",
              callback_data: "joined",
            },
          ],
        ],
      },
    }),
  }
);

      return new Response("ok");
    }

    if (data.startsWith("joinreject_")) {
      const requestId = Number(data.replace("joinreject_", ""));

      await supabase
        .from("table_join_requests")
        .update({
          status: "rejected",
        })
        .eq("id", requestId);

      await answer("Подключение отклонено");
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
          "Content-Type":
            "application/json",
        },
      }
    );
  }
});


