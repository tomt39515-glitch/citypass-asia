import React, { useState } from "react";
import QRScanner from "../components/QRScanner";

export default function PartnerDashboard({ currentTab }) {
  const [token, setToken] = useState(null);
  const [amount, setAmount] = useState("");

  async function redeemQR() {
    try {
      const response = await fetch(
        "https://doswzyuumcwxjmltcgeh.supabase.co/functions/v1/redeem-qr",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            partner_telegram_id: 7308888014,
            amount: Number(amount),
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        alert(data.error);
        return;
      }

      alert(
        `Покупка проведена

Сумма: ${data.original_amount}
Скидка: ${data.discount}
К оплате: ${data.final_amount}`
      );

      setToken(null);
      setAmount("");
    } catch (err) {
      alert(err.message);
    }
  }

  if (currentTab === "scanner") {
    return (
      <div style={{ padding: 20 }}>
        <h1>QR Scanner</h1>

        {!token ? (
          <QRScanner
            onScanSuccess={(decodedText) => {
              setToken(decodedText);
            }}
          />
        ) : (
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 20,
            }}
          >
            <h2>Клиент найден</h2>

            <input
              type="number"
              placeholder="Сумма покупки"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
              style={{
                width: "100%",
                padding: 12,
                marginTop: 20,
                borderRadius: 10,
                border: "1px solid #ddd",
              }}
            />

            <button
              onClick={redeemQR}
              style={{
                marginTop: 20,
                width: "100%",
                padding: 14,
                border: "none",
                borderRadius: 12,
                background: "#2563eb",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Подтвердить покупку
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Кабинет партнёра</h1>
    </div>
  );
}