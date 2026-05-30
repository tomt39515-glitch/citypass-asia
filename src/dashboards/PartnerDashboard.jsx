import React, { useState } from "react";
import QRScanner from "../components/QRScanner";

export default function PartnerDashboard() {
  const [showScanner, setShowScanner] =
    useState(false);

  const handleScanSuccess = (data) => {
    console.log("QR DATA:", data);

    alert(
      `Клиент найден: ${
        data.name || data.clientId
      }`
    );

    setShowScanner(false);
  };

  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f7fb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg,#16a34a,#22c55e)",
          borderRadius: "24px",
          padding: "24px",
          color: "#fff",
        }}
      >
        <h2>🏪 Burger House</h2>

        <div>⭐ Рейтинг 4.9</div>

        <div style={{ marginTop: "15px" }}>
          Партнёр CityPass Asia
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <div>Клиентов сегодня</div>
          <h2>24</h2>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <div>Скидок сегодня</div>
          <h2>1 250 000 ₫</h2>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
          textAlign: "center",
        }}
      >
        <button
          onClick={() =>
            setShowScanner(true)
          }
          style={{
            background:
              "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "#fff",
            border: "none",
            borderRadius: "16px",
            padding: "16px 24px",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          📷 Сканировать QR
        </button>
      </div>

      {showScanner && (
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <h3>Сканирование QR</h3>

          <QRScanner
            onScanSuccess={
              handleScanSuccess
            }
          />

          <button
            onClick={() =>
              setShowScanner(false)
            }
            style={{
              marginTop: "16px",
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "14px",
              background: "#ef4444",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Закрыть сканер
          </button>
        </div>
      )}

      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <h3>Последние клиенты</h3>

        <div style={{ marginTop: "10px" }}>
          👤 Виталий К.
        </div>

        <div style={{ marginTop: "10px" }}>
          👤 Иван П.
        </div>

        <div style={{ marginTop: "10px" }}>
          👤 Анна С.
        </div>
      </div>
    </div>
  );
}