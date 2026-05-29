import React, { useState } from "react";

export default function PartnerScanner() {
  const [clientId, setClientId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  async function processTransaction() {
    try {
      if (!clientId || !amount) {
        setMessage("Заполни ID клиента и сумму");
        return;
      }

      setMessage("Обработка...");

      const res = await fetch(
        "https://doswzyuumcwxjmltcgeh.supabase.co/functions/v1/save-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            partner_id: 1,
            client_id: Number(clientId),
            amount: Number(amount),
            token: "test",
          }),
        }
      );

      console.log("STATUS:", res.status);

      const raw = await res.text();

      console.log("RAW RESPONSE:", raw);

      if (!raw || raw.trim() === "") {
        setMessage("Пустой ответ от сервера");
        return;
      }

      let data = {};

      try {
        data = JSON.parse(raw);
      } catch {
        setMessage("Сервер вернул некорректный ответ");
        return;
      }

      if (!res.ok) {
        setMessage(data.error || "Ошибка сервера");
        return;
      }

      setMessage("Покупка проведена успешно ✅");
      setClientId("");
      setAmount("");
    } catch (err) {
      console.error(err);
      setMessage("Ошибка соединения");
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Партнер CityPass</h1>

      <input
        placeholder="ID клиента"
        value={clientId}
        onChange={(e) => setClientId(e.target.value)}
        style={{
          display: "block",
          marginBottom: 10,
          padding: 10,
          width: 300,
        }}
      />

      <input
        placeholder="Сумма покупки"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{
          display: "block",
          marginBottom: 10,
          padding: 10,
          width: 300,
        }}
      />

      <button
        onClick={processTransaction}
        style={{
          padding: 12,
          background: "green",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Провести покупку
      </button>

      <p style={{ marginTop: 20 }}>{message}</p>
    </div>
  );
}