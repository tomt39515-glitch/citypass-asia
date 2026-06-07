import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function ClientOrdersTab() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
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
                marginBottom: 6,
              }}
            >
              {order.order_number}
            </div>

            <div>
              {statusLabel(order.status)}
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

        {selectedOrder && (
          <div
            style={{
              marginTop: 24,
              borderTop:
                "2px solid #E2E8F0",
              paddingTop: 20,
            }}
          >
            <h3>
              Заказ{" "}
              {
                selectedOrder.order_number
              }
            </h3>

            {orderItems.map((item) => (
              <div
                key={item.id}
                style={{
                  padding: 10,
                  borderBottom:
                    "1px solid #F1F5F9",
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                  }}
                >
                  {
                    item.item_name_snapshot
                  }
                </div>

                <div>
                  Количество:
                  {" "}
                  {item.quantity}
                </div>

                <div>
                  Цена:
                  {" "}
                  {item.unit_price}
                </div>

                <div>
                  Итого:
                  {" "}
                  {item.total_price}
                </div>
              </div>
            ))}

            <div
              style={{
                marginTop: 16,
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              Итого:
              {" "}
              {
                selectedOrder.total_amount
              }
              {" "}
              {
                selectedOrder.currency
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}