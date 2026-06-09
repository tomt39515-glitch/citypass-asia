import React from "react";

export default function CartPanel({
  cart,
  partner,
  onIncrease,
  onDecrease,
  onSubmitOrder,
  loading,
}) {
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const discountPercent = Number(
    partner?.discount_percent ||
      partner?.discount ||
      0
  );

  const discountAmount =
    subtotal * (discountPercent / 100);

  const totalAmount =
    subtotal - discountAmount;

  if (!cart.length) return null;

  return (
    <div
      style={{
        position: "sticky",
        bottom: 0,
        background: "#fff",
        borderTop: "1px solid #ddd",
        padding: 16,
        marginTop: 20,
        boxShadow:
          "0 -2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <h3>
        🛒 Корзина (
        {cart.reduce(
          (sum, item) =>
            sum + item.quantity,
          0
        )}
        )
      </h3>

      {cart.map((item) => (
        <div
          key={item.id}
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <div>
            <strong>
              {item.name}
            </strong>

            <div>
              {item.price.toLocaleString()}{" "}
              VND
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
            }}
          >
            <button
              onClick={() =>
                onDecrease(item.id)
              }
            >
              -
            </button>

            <strong>
              {item.quantity}
            </strong>

            <button
              onClick={() =>
                onIncrease(item.id)
              }
            >
              +
            </button>
          </div>
        </div>
      ))}

      <hr />

      <div>
        Сумма:
        {" "}
        {subtotal.toLocaleString()}
        {" "}
        VND
      </div>

      <div
        style={{
          color: "#16a34a",
          fontWeight: 600,
        }}
      >
        🎁 Скидка:
        {" "}
        -
        {discountAmount.toLocaleString()}
        {" "}
        VND
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 700,
          marginTop: 8,
        }}
      >
        К оплате:
        {" "}
        {totalAmount.toLocaleString()}
        {" "}
        VND
      </div>

      <button
        onClick={onSubmitOrder}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: 12,
          padding: 14,
          background: loading
            ? "#94a3b8"
            : "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 600,
          opacity: loading ? 0.6 : 1,
          cursor: loading
            ? "not-allowed"
            : "pointer",
        }}
      >
        {loading
          ? "⏳ Отправка..."
          : "📤 Отправить заказ"}
      </button>
    </div>
  );
}