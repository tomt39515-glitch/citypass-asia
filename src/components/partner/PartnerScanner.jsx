import React, { useState } from "react";
import QRScanner from "../QRScanner";

export default function PartnerScanner() {
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  async function processTransaction() {
    try {
      if (!token) {
        setMessage("Сначала отсканируйте QR");
        return;
      }

      if (!amount) {
        setMessage("Введите сумму покупки");
        return;
      }

      setMessage("Обработка...");

      const res = await fetch(
        "https://doswzyuumcwxjmltcgeh.supabase.co/functions/v1/redeem-qr",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            partner_telegram_id: 8052071718,
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        setMessage(data.error || "Ошибка");
        return;
      }

      setMessage(
        `Покупка проведена ✅ Клиент оплатил ${data.final_amount} VND`
      );

      setToken("");
      setAmount("");
    } catch (err) {
      console.error(err);
      setMessage("Ошибка соединения");
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Партнёр CityPass</h1>

      {!token && (
        <QRScanner
          onScanSuccess={({ token }) => {
            setToken(token);
            setMessage("QR успешно считан ✅");
          }}
        />
      )}

      {token && (
        <>
          <div
            style={{
              padding: 12,
              marginBottom: 15,
              background: "#e8f5e9",
              borderRadius: 10,
            }}
          >
            Клиент найден ✅
          </div>

          <input
            placeholder="Сумма покупки"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              display: "block",
              marginBottom: 10,
              padding: 10,
              width: "100%",
              maxWidth: 300,
            }}
          />

          <button
            onClick={processTransaction}
            style={{
              padding: 12,
              background: "green",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Провести покупку
          </button>
        </>
      )}

      <p style={{ marginTop: 20 }}>{message}</p>
    </div>
  );
}