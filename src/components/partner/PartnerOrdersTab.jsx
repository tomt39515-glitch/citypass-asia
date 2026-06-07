import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerOrdersTab() {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedOrder, setSelectedOrder] = useState(null);
const [orderItems, setOrderItems] = useState([]);
const [messages, setMessages] = useState([]);
const [newMessage, setNewMessage] = useState("");
const [showChat, setShowChat] = useState(false);

useEffect(() => {
loadOrders();
}, []);
useEffect(() => {
  const channel = supabase
    .channel("partner-orders")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "orders",
      },
      async () => {
        console.log("Новый заказ");
        await loadOrders();
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

  const { data: partner } = await supabase
    .from("partners")
    .select("*")
    .eq("telegram_id", Number(telegramId))
    .order("id", { ascending: false })
    .limit(1)
    .single();

  if (!partner) {
    setLoading(false);
    return;
  }

  const { data, error } = await supabase
  .from("orders")
  .select(`
    *,
    clients (
      full_name,
      telegram_id
    )
  `)
  .eq("partner_id", partner.id)
  .order("created_at", {
    ascending: false,
  });
  if (error) throw error;

  setOrders(data || []);

console.log(
  "Загружено заказов:",
  data?.length || 0
);
} catch (err) {
  console.error(err);
  alert(err.message);
} finally {
  setLoading(false);
}


}

async function openOrder(order) {
  try {
    setSelectedOrder(order);

    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (error) throw error;

    setOrderItems(data || []);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
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
    .channel(`partner-chat-${selectedOrder.id}`)
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

  // звук
  try {
    new Audio("/notification.mp3").play();
  } catch (e) {
    console.log(e);
  }

  // вызов официанта
  if (
    payload.new.message ===
    "🔔 ВЫЗОВ ОФИЦИАНТА"
  ) {
    alert(
      "🔔 Клиент вызывает официанта"
    );
  } else {
    alert(
      "💬 Новое сообщение от клиента"
    );
  }
}
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [selectedOrder]);
async function updateStatus(newStatus) {
try {
const oldStatus = selectedOrder.status;


  const { error } = await supabase
    .from("orders")
    .update({
      status: newStatus,
    })
    .eq("id", selectedOrder.id);

  if (error) throw error;

  await supabase
    .from("order_status_history")
    .insert({
      order_id: selectedOrder.id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by_role: "partner",
    });

  const updatedOrder = {
    ...selectedOrder,
    status: newStatus,
  };

  setSelectedOrder(updatedOrder);

  setOrders((prev) =>
    prev.map((item) =>
      item.id === selectedOrder.id
        ? updatedOrder
        : item
    )
  );
} catch (err) {
  console.error(err);
  alert(err.message);
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
background: "transparent",
fontSize: 16,
cursor: "pointer",
marginBottom: 20,
}}
>
← Назад </button>


      <h2>
        📦 {selectedOrder.order_number}
      </h2>
<div
  style={{
    background: "#F8FAFC",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  }}
>
  <div
    style={{
      fontWeight: 600,
    }}
  >
    👤 {selectedOrder.clients?.full_name || "Клиент"}
  </div>

  <div
    style={{
      color: "#64748B",
      marginTop: 4,
    }}
  >
    📱 {selectedOrder.clients?.telegram_id || "-"}
  </div>
</div>
      <div
  style={{
    marginBottom: 16,
    color: "#64748B",
  }}
>
  Статус: {selectedOrder.status}
</div>

<button
  onClick={async () => {
  await loadMessages(selectedOrder.id);
  setShowChat(true);
}}
  style={{
    width: "100%",
    padding: 14,
    marginBottom: 16,
    border: "none",
    borderRadius: 12,
    background: "#14B8A6",
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  }}
>
  💬 Чат с клиентом
</button>

      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        {selectedOrder.status ===
          "pending" && (
          <>
            <button
              onClick={() =>
                updateStatus(
                  "accepted"
                )
              }
            >
              ✅ Принять
            </button>

            <button
              onClick={() =>
                updateStatus(
                  "cancelled"
                )
              }
            >
              ❌ Отменить
            </button>
          </>
        )}

        {selectedOrder.status ===
          "accepted" && (
          <button
            onClick={() =>
              updateStatus(
                "preparing"
              )
            }
          >
            👨‍🍳 Готовится
          </button>
        )}

        {selectedOrder.status ===
          "preparing" && (
          <button
            onClick={() =>
              updateStatus("ready")
            }
          >
            📦 Готов
          </button>
        )}

        {selectedOrder.status ===
          "ready" && (
          <button
            onClick={() =>
              updateStatus(
                "completed"
              )
            }
          >
            ✅ Выдан клиенту
          </button>
        )}
      </div>
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
              msg.sender_role === "partner"
                ? "#DCFCE7"
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

    const { error } = await supabase
      .from("order_messages")
      .insert({
        order_id: selectedOrder.id,
        sender_role: "partner",
        sender_id: 0,
        message: newMessage,
      });

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
      {orderItems.map((item) => (
        <div
          key={item.id}
          style={{
            padding: 12,
            marginBottom: 10,
            borderRadius: 12,
            background: "#F8FAFC",
          }}
        >
          <div
            style={{
              fontWeight: 700,
            }}
          >
            {item.item_name_snapshot}
          </div>

          <div>
            Количество: {item.quantity}
          </div>

          <div>
            Цена: {item.unit_price}
          </div>

          <div>
            Итого: {item.total_price}
          </div>
        </div>
      ))}

      <div
        style={{
          marginTop: 20,
          fontSize: 20,
          fontWeight: 700,
        }}
      >
        Итого: {selectedOrder.total_amount}{" "}
        {selectedOrder.currency}
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
> <h2>📦 Заказы</h2>


    {loading && (
      <div>Загрузка заказов...</div>
    )}

    {!loading &&
      orders.length === 0 && (
        <div>
          Пока заказов нет
        </div>
      )}

    {orders.map((order) => (
      <div
        key={order.id}
        onClick={() => openOrder(order)}
        style={{
          border: "1px solid #E2E8F0",
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 16,
          }}
        >
          {order.order_number}
        </div>

        <div>
          Статус: {order.status}
        </div>

        <div>
          Сумма: {order.total_amount}{" "}
          {order.currency}
        </div>
      </div>
    ))}
  </div>
</div>


);
}
