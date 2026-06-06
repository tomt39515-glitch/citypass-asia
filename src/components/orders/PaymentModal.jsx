import React from "react";

export default function PaymentModal({
  isOpen,
  subtotal = 0,
  discountAmount = 0,
  totalAmount = 0,
  partner,
  onCashPayment,
  onQrPayment,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          width: "90%",
          maxWidth: 420,
        }}
      >
        <h3>Оплата заказа</h3>

        <div
          style={{
            marginTop: 12,
          }}
        >
          Сумма:
          {" "}
          {subtotal.toLocaleString()}
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
          {discountAmount.toLocaleString()}
          {" "}
          VND
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          К оплате:
          {" "}
          {totalAmount.toLocaleString()}
          {" "}
          VND
        </div>

        <button
          onClick={onCashPayment}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 14,
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: 10,
          }}
        >
          💵 Оплатить наличными
        </button>

        <button
          onClick={onQrPayment}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 14,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 10,
          }}
        >
          📱 Оплатить по QR
        </button>

        {partner?.payment_qr_url && (
          <img
            src={partner.payment_qr_url}
            alt="QR"
            style={{
              width: "100%",
              marginTop: 16,
              borderRadius: 12,
            }}
          />
        )}

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: 12,
            padding: 12,
          }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}