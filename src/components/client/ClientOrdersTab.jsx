import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function ClientOrdersTab() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const [showChat, setShowChat] = useState(false);
const [paymentLoading, setPaymentLoading] = useState(false);
const [partnerQrUrl, setPartnerQrUrl] = useState("");
const [confirmingPayment, setConfirmingPayment] = useState(false);

 useEffect(() => {
  loadOrders();

  const channel = supabase
    .channel("client-orders-realtime")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "orders",
      },
      (payload) => {
        setOrders((prev) =>
          prev.map((order) =>
            order.id === payload.new.id
              ? payload.new
              : order
          )
        );

        setSelectedOrder((prev) => {
          if (!prev) return prev;

          if (prev.id === payload.new.id) {
            return payload.new;
          }

          return prev;
        });
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);

  async function loadOrders() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId) {
        setLoading(false);
        return;
      }

      const { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("telegram_id", String(telegramId))
        .single();

      if (!client) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("client_id", client.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function openOrder(order) {
    setSelectedOrder(order);

    const { data } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    setOrderItems(data || []);

    const { data: partner } = await supabase
      .from("partners")
      .select("payment_qr_url")
      .eq("id", order.partner_id)
      .single();

    setPartnerQrUrl(partner?.payment_qr_url || "");
  }
async function loadMessages(orderId) {
  const { data } = await supabase
    .from("order_messages")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", {
      ascending: true,
    });

  setMessages(data || []);
}
useEffect(() => {
  if (!selectedOrder) return;

  const channel = supabase
    .channel(`chat-${selectedOrder.id}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "order_messages",
        filter: `order_id=eq.${selectedOrder.id}`,
      },
      (payload) => {
        setMessages((prev) => [
          ...prev,
          payload.new,
        ]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [selectedOrder]);
  function statusLabel(status) {
    switch (status) {
      case "pending":
        return "🟡 Ожидает";
      case "accepted":
        return "🟢 Принят";
      case "preparing":
        return "👨‍🍳 Готовится";
      case "ready":
        return "📦 Готов";
      case "completed":
        return "✅ Выполнен";
      case "cancelled":
        return "❌ Отменён";
      default:
        return status;
    }
  }

  
async function selectPaymentMethod(method) {
  try {
    if (!selectedOrder) return;

    setPaymentLoading(true);

    const updateData = {
      payment_method: method,
      bill_status: "requested",
      bill_requested_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from("orders")
      .update(updateData)
      .eq("id", selectedOrder.id);

    if (error) throw error;

    setSelectedOrder({
      ...selectedOrder,
      ...updateData,
    });

    alert(
      method === "cash"
        ? "Выбрана оплата наличными"
        : "Выбрана оплата по QR"
    );
  } catch (err) {
    alert(err.message);
  } finally {
    setPaymentLoading(false);
  }
}



async function confirmQrPayment() {
  try {
    if (confirmingPayment) return;

    if (selectedOrder.payment_status === "payment_claimed") {
      alert("Оплата уже была отправлена на проверку");
      return;
    }

    setConfirmingPayment(true);

    const { data: partner } = await supabase
      .from("partners")
      .select("telegram_id,business_name")
      .eq("id", selectedOrder.partner_id)
      .single();

    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "payment_claimed",
      })
      .eq("id", selectedOrder.id);

    if (error) throw error;

    await supabase.from("order_messages").insert({
      order_id: selectedOrder.id,
      sender_role: "client",
      sender_id: 0,
      message: `💰 Клиент сообщил об оплате заказа ${selectedOrder.order_number}`,
    });

    if (partner?.telegram_id) {
      await fetch(
        "https://doswzyuumcwxjmltcgeh.supabase.co/functions/v1/send-telegram-notification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chat_id: partner.telegram_id,
            text:
              `💰 Клиент сообщил об оплате\n\n` +
              `Заказ: ${selectedOrder.order_number}\n` +
              `Сумма: ${selectedOrder.total_amount} ${selectedOrder.currency}\n` +
              `Столик: ${selectedOrder.current_table_number || "-"}\n\n` +
              `Проверьте поступление средств.`,
          }),
        }
      );
    }

    setSelectedOrder({
      ...selectedOrder,
      payment_status: "payment_claimed",
    });

    alert("Информация об оплате отправлена");
  } catch (err) {
    alert(err.message);
  } finally {
    setConfirmingPayment(false);
  }
}


function statusStyle(status) {
    switch (status) {
      case "pending":
        return {
          background: "#FEF3C7",
          color: "#92400E",
        };

      case "accepted":
        return {
          background: "#DCFCE7",
          color: "#166534",
        };

      case "preparing":
        return {
          background: "#DBEAFE",
          color: "#1D4ED8",
        };

      case "ready":
        return {
          background: "#E0E7FF",
          color: "#4338CA",
        };

      case "completed":
        return {
          background: "#D1FAE5",
          color: "#065F46",
        };

      case "cancelled":
        return {
          background: "#FEE2E2",
          color: "#991B1B",
        };

      default:
        return {
          background: "#F1F5F9",
          color: "#475569",
        };
    }
  }

  if (selectedOrder) {
    return (
      <div style={{ padding: 16 }}>
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: 20,
          }}
        >
          <button
            onClick={() => {
              setSelectedOrder(null);
              setOrderItems([]);
            }}
            style={{
              border: "none",
              background: "#F1F5F9",
              padding: "10px 14px",
              borderRadius: 12,
              marginBottom: 20,
              cursor: "pointer",
            }}
          >
            ← Назад
          </button>

          <h2>📦 Заказ</h2>

          <div
            style={{
              fontWeight: 700,
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            {selectedOrder.order_number}
          </div>

          <div
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
              ...statusStyle(
                selectedOrder.status
              ),
            }}
          >
            {statusLabel(
              selectedOrder.status
            )}
          </div>


{selectedOrder.bill_status === "requested" && (
  <div
    style={{
      marginBottom: 20,
      padding: "16px",
      background: "#DCFCE7",
      color: "#166534",
      borderRadius: 12,
      fontWeight: 700,
    }}
  >
    {selectedOrder.payment_method === "cash" ? (
      "💵 Выбрана оплата наличными. Ожидайте сотрудника."
    ) : (
      <div>
        <div style={{ marginBottom: 12 }}>
          📱 Оплата по QR
        </div>

        <div style={{ marginBottom: 12 }}>
          Сумма: {Number(selectedOrder.total_amount || 0).toLocaleString()} ₫
        </div>

        {partnerQrUrl && (
          <img
            src={partnerQrUrl}
            alt="QR"
            style={{
              width: 260,
              maxWidth: "100%",
              borderRadius: 12,
              marginBottom: 12,
            }}
          />
        )}

        <div style={{ marginBottom: 12 }}>
          Комментарий: {selectedOrder.order_number}
        </div>

        <button
          onClick={confirmQrPayment}
          disabled={confirmingPayment || selectedOrder.payment_status === "payment_claimed"}
          style={{
            padding: 14,
            border: "none",
            borderRadius: 12,
            background: "#14B8A6",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          ✅ Я оплатил
        </button>
      </div>
    )}
  </div>
)}


{selectedOrder.bill_status === "open" && (
  <div
    style={{
      marginBottom: 20,
      padding: "16px",
      background: "#FEF3C7",
      color: "#92400E",
      borderRadius: 12,
    }}
  >
    <div
      style={{
        fontWeight: 700,
        marginBottom: 8,
      }}
    >
      🟡 Счёт открыт
    </div>

    <div
      style={{
        fontSize: 24,
        fontWeight: 800,
      }}
    >
      {Number(
        selectedOrder.total_amount || 0
      ).toLocaleString()} ₫
    </div>

    <div
      style={{
        display: "flex",
        gap: 10,
        marginTop: 16,
      }}
    >
      <button
        onClick={() => selectPaymentMethod("cash")}
        disabled={paymentLoading}
        style={{
          flex: 1,
          padding: 14,
          border: "none",
          borderRadius: 12,
          background: "#F59E0B",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        💵 Наличные
      </button>

      <button
        onClick={() => selectPaymentMethod("qr")}
        disabled={paymentLoading}
        style={{
          flex: 1,
          padding: 14,
          border: "none",
          borderRadius: 12,
          background: "#14B8A6",
          color: "#fff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        📱 QR Оплата
      </button>
    </div>
  </div>
)}

<button
 onClick={async () => {
  await loadMessages(
    selectedOrder.id
  );

  setShowChat(true);
}}
  style={{
    width: "100%",
    padding: 14,
    marginBottom: 20,
    border: "none",
    borderRadius: 12,
    background: "#14B8A6",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  }}
>
  💬 Чат с партнером
</button>
<button
  onClick={async () => {
    const { error } = await supabase
      .from("order_messages")
      .insert({
        order_id: selectedOrder.id,
        sender_role: "client",
        sender_id: 0,
        message: "🔔 ВЫЗОВ ОФИЦИАНТА",
      });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Официант вызван");
  }}
  style={{
    width: "100%",
    padding: 14,
    marginBottom: 20,
    border: "none",
    borderRadius: 12,
    background: "#F59E0B",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  }}
>
  🔔 Позвать официанта
</button>
{showChat && (
  <div
    style={{
      background: "#F8FAFC",
      borderRadius: 16,
      padding: 12,
      marginBottom: 20,
    }}
  >
    <h3>💬 Чат заказа</h3>

    <div
      style={{
        maxHeight: 300,
        overflowY: "auto",
        marginBottom: 12,
      }}
    >
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            marginBottom: 10,
            padding: 10,
            borderRadius: 10,
            background:
              msg.sender_role === "client"
                ? "#DBEAFE"
                : "#FFFFFF",
          }}
        >
          {msg.message}
        </div>
      ))}
    </div>

    <input
      value={newMessage}
      onChange={(e) =>
        setNewMessage(e.target.value)
      }
      placeholder="Введите сообщение..."
      style={{
        width: "100%",
        padding: 10,
        marginBottom: 10,
        border: "1px solid #E2E8F0",
        borderRadius: 10,
      }}
    />

    <button
      onClick={async () => {
        if (!newMessage.trim()) return;

        const { data, error } = await supabase
  .from("order_messages")
  .insert({
    order_id: selectedOrder.id,
    sender_role: "client",
    sender_id: 0,
    message: newMessage,
  });

console.log("INSERT RESULT", data);
console.log("INSERT ERROR", error);

if (error) {
  alert(error.message);
  return;
}

        setNewMessage("");
      }}
      style={{
        width: "100%",
        padding: 12,
        border: "none",
        borderRadius: 10,
        background: "#14B8A6",
        color: "#fff",
        fontWeight: 700,
      }}
    >
      Отправить
    </button>
  </div>
)}

          {selectedOrder.service_type ===
            "table" && (
            <div
              style={{
                marginBottom: 20,
              }}
            >
              🍽 Столик №
              {
                selectedOrder.current_table_number ||
                selectedOrder.table_number
              }
            </div>
          )}

          {orderItems.map((item) => (
            <div
              key={item.id}
              style={{
                border:
                  "1px solid #E2E8F0",
                borderRadius: 16,
                padding: 14,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {
                  item.item_name_snapshot
                }
              </div>

              <div>
                Количество:{" "}
                {item.quantity}
              </div>

              <div>
                Цена:{" "}
                {item.unit_price}
              </div>

              <div>
                Сумма:{" "}
                {item.total_price}
              </div>
            </div>
          ))}

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop:
                "2px solid #E2E8F0",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            Итого:{" "}
            {
              selectedOrder.total_amount
            }{" "}
            {
              selectedOrder.currency
            }
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 20,
        }}
      >
        <h2>📦 Мои заказы</h2>

        {loading && (
          <div>Загрузка...</div>
        )}

        {!loading &&
          orders.length === 0 && (
            <div>
              У вас пока нет заказов
            </div>
          )}

        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() =>
              openOrder(order)
            }
            style={{
              border:
                "1px solid #E2E8F0",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {order.order_number}
            </div>

            <div
              style={{
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 10,
                ...statusStyle(
                  order.status
                ),
              }}
            >
              {statusLabel(
                order.status
              )}
            </div>

            <div>
              💰 {order.total_amount}{" "}
              {order.currency}
            </div>

            {order.service_type ===
              "table" && (
              <div>
                🍽 Столик №
                {order.current_table_number ||
                  order.table_number}
              </div>
            )}

            <div
              style={{
                fontSize: 12,
                color: "#64748B",
                marginTop: 6,
              }}
            >
              {new Date(
                order.created_at
              ).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}