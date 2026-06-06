import React from "react";

export default function OrderHistoryPanel({
  order,
  items = [],
  onAddMore,
  onOpenPayment,
  onCallWaiter,
}) {
  if (!order) return null;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: 12,
        padding: 16,
        marginTop: 20,
        background: "#fff",
      }}
    >
      <h3>
        🧾 Заказ #{order.id}
      </h3>

      <div
        style={{
          marginTop: 8,
          color: "#666",
        }}
      >
        Статус:
        {" "}
        {order.status}
      </div>

      <div
        style={{
          marginTop: 16,
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: 8,
            }}
          >
            <div>
              {item.item_name_snapshot}
            </div>

            <div>
              x{item.quantity}
            </div>
          </div>
        ))}
      </div>

      <hr />

      <div
        style={{
          marginTop: 12,
        }}
      >
        Сумма:
        {" "}
        {Number(
          order.subtotal || 0
        ).toLocaleString()}
        {" "}
        VND
      </div>

      <div
        style={{
          marginTop: 8,
          color: "#16a34a",
          fontWeight: 600,
        }}
      >
        🎁 Скидка:
        {" "}
        -
        {Number(
          order.discount_amount || 0
        ).toLocaleString()}
        {" "}
        VND
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        К оплате:
        {" "}
        {Number(
          order.total_amount || 0
        ).toLocaleString()}
        {" "}
        VND
      </div>

      <button
        onClick={onAddMore}
        style={{
          width: "100%",
          marginTop: 16,
          padding: 12,
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 10,
        }}
      >
        ➕ Дозаказать
      </button>

      <button
        onClick={onCallWaiter}
        style={{
          width: "100%",
          marginTop: 10,
          padding: 12,
          background: "#f59e0b",
          color: "#fff",
          border: "none",
          borderRadius: 10,
        }}
      >
        🔔 Позвать официанта
      </button>

      <button
        onClick={onOpenPayment}
        style={{
          width: "100%",
          marginTop: 10,
          padding: 12,
          background: "#16a34a",
          color: "#fff",
          border: "none",
          borderRadius: 10,
        }}
      >
        💵 Оплатить
      </button>
    </div>
  );
}