import React, { useState } from "react";
import QRScanner from "../QRScanner";

export default function PartnerScanner() {
  const [token, setToken] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const amountNumber = Number(amount || 0);
  const discountAmount = amountNumber * 0.10;
  const citypassAmount = amountNumber * 0.05;
  const finalAmount = amountNumber - discountAmount;

  const telegramId =
    window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

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
            partner_telegram_id: Number(telegramId),
            amount: Number(amount),
          }),
        }
      );

      const data = await res.json();

      console.log("STATUS:", res.status);
      console.log("DATA:", data);

      if (!data.success) {
        setMessage(
          JSON.stringify(data, null, 2)
        );
        return;
      }

      setMessage(`
✅ Покупка проведена

Сумма покупки: ${data.original_amount} VND

Скидка клиенту:
${data.discount} VND

Комиссия CityPass:
${data.citypass_fee} VND

К оплате клиентом:
${data.final_amount} VND

Бонусный баланс:
${data.bonus_balance_left} VND

Основной баланс:
${data.deposit_balance_left} VND

Общий баланс:
${data.partner_balance_left} VND
      `);

      setToken("");
      setAmount("");
    } catch (err) {
      console.error(err);

      setMessage(
        err?.message || String(err)
      );
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

          {amountNumber > 0 && (
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 15,
                marginBottom: 15,
                maxWidth: 350,
              }}
            >
              <div>Сумма покупки: {amountNumber} VND</div>
              <div>Скидка клиенту 10%: {discountAmount} VND</div>
              <div>Комиссия CityPass 5%: {citypassAmount} VND</div>
              <hr />
              <div style={{ fontWeight: "700" }}>
                Клиент оплатит: {finalAmount} VND
              </div>
            </div>
          )}

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

      <pre
        style={{
          marginTop: 20,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {message}
      </pre>
    </div>
  );
}