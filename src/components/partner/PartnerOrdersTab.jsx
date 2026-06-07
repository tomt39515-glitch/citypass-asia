import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerOrdersTab() {
const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
const [selectedOrder, setSelectedOrder] = useState(null);
const [orderItems, setOrderItems] = useState([]);

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

    {!loading && orders.length === 0 && (
      <div>Пока заказов нет</div>
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
          Сумма: {order.total_amount} {order.currency}
        </div>

        <div
          style={{
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

    {selectedOrder && (
      <div
        style={{
          marginTop: 20,
          borderTop: "2px solid #E2E8F0",
          paddingTop: 20,
        }}
      >
        <h3>
          Заказ {selectedOrder.order_number}
        </h3>

        {orderItems.length === 0 && (
          <div>Товары не найдены</div>
        )}

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
            marginTop: 16,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Итого заказ:{" "}
          {selectedOrder.total_amount}{" "}
          {selectedOrder.currency}
        </div>
      </div>
    )}
  </div>
</div>


);
}
