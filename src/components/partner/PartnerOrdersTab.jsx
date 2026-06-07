import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerOrdersTab() {
  const [orders, setOrders] = useState([]);
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
        .select("*")
        .eq("partner_id", partner.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setOrders(data || []);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
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
        <h2>📦 Заказы</h2>

        {loading && (
          <div>Загрузка заказов...</div>
        )}

        {!loading && orders.length === 0 && (
          <div>
            Пока заказов нет
          </div>
        )}

        {orders.map((order) => (
          <div
            key={order.id}
            style={{
              border: "1px solid #E2E8F0",
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
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

            <div
              style={{
                marginTop: 6,
              }}
            >
              Статус: {order.status}
            </div>

            <div
              style={{
                marginTop: 6,
              }}
            >
              Сумма: {order.total_amount}{" "}
              {order.currency}
            </div>

            <div
              style={{
                marginTop: 6,
                color: "#64748B",
                fontSize: 13,
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