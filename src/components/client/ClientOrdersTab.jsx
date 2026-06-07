import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function ClientOrdersTab() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }

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
<button
  onClick={() =>
    alert(
      `Чат с партнером\nЗаказ: ${selectedOrder.order_number}`
    )
  }
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
          {selectedOrder.service_type ===
            "table" && (
            <div
              style={{
                marginBottom: 20,
              }}
            >
              🍽 Столик №
              {
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
                {order.table_number}
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