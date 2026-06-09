import { useEffect, useState } from "react";

function Orders() {
  const [orders, setOrders] = useState([]);

  return (
    <div className="app" style={{ padding: 16 }}>
      <h1>📦 Мои заказы</h1>

      {orders.length === 0 ? (
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: 24,
            textAlign: "center",
          }}
        >
          Заказов пока нет
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 20,
              marginBottom: 16,
            }}
          >
            <h3>{order.order_number}</h3>

            <div>🍽 Столик №{order.table_number}</div>

            <div
              style={{
                marginTop: 10,
                color:
                  order.bill_status === "open"
                    ? "#d97706"
                    : "#16a34a",
              }}
            >
              {order.bill_status === "open"
                ? "🟡 Счёт открыт"
                : "✅ Счёт закрыт"}
            </div>

            <hr />

            <div>Сумма: {order.subtotal} USD</div>
            <div>🎁 Скидка: -{order.discount_amount} USD</div>

            <div
              style={{
                marginTop: 8,
                fontWeight: 700,
                fontSize: 22,
              }}
            >
              К оплате: {order.total_amount} USD
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Orders;
