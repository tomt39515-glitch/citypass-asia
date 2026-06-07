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
          marginBottom: 16,
          color: "#64748B",
        }}
      >
        Статус: {selectedOrder.status}
      </div>

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
        Итого: {selectedOrder.total_amount} {selectedOrder.currency}
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
      </div>
    ))}
  </div>
</div>


);
}
