import React from "react";

export default function OrderStatusPanel({
  order,
}) {
  if (!order) return null;

  const statuses = [
    {
      key: "pending",
      label: "⏳ Ожидает подтверждения",
    },
    {
      key: "accepted",
      label: "✅ Принят",
    },
    {
      key: "preparing",
      label: "👨‍🍳 Готовится",
    },
    {
      key: "ready",
      label: "🔔 Готов",
    },
    {
      key: "completed",
      label: "✔ Завершён",
    },
  ];

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
        Заказ #{order.id}
      </h3>

      <div
        style={{
          marginTop: 12,
        }}
      >
        {statuses.map((status) => {
          const active =
            status.key ===
            order.status;

          return (
            <div
              key={status.key}
              style={{
                padding: 8,
                marginBottom: 8,
                borderRadius: 8,
                background: active
                  ? "#dcfce7"
                  : "#f3f4f6",
                fontWeight: active
                  ? 700
                  : 400,
              }}
            >
              {status.label}
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 12,
          fontWeight: 600,
        }}
      >
        Сумма:
        {" "}
        {Number(
          order.total_amount || 0
        ).toLocaleString()}
        {" "}
        {order.currency || "VND"}
      </div>
    </div>
  );
}