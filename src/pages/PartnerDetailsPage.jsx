import React, { useEffect, useState } from "react";

const SUPABASE_URL = "https://doswzyuumcwxjmltcgeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_5_sw0Rk7sPg-SMTgI1aTkA_Vb5QAZRP";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export default function PartnerDetailsPage({ partner, onBack }) {
  const [transactions, setTransactions] = useState([]);

  async function safeFetch(url) {
    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Ошибка");
    }

    if (response.status === 204) {
      return [];
    }

    return response.json();
  }

  async function loadTransactions() {
    if (!partner?.id) return;

    try {
      const data = await safeFetch(
        `${SUPABASE_URL}/rest/v1/transactions?partner_id=eq.${partner.id}&select=original_amount,citypass_amount,final_amount,created_at&order=created_at.desc`
      );

      setTransactions(data || []);
    } catch (e) {
      alert(e.message);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, [partner]);

  if (!partner) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={onBack}>Назад</button>
        <div style={{ marginTop: 20 }}>Загрузка партнёра...</div>
      </div>
    );
  }

  const totalSales = transactions.reduce(
    (sum, item) => sum + Number(item.original_amount || 0),
    0
  );

  const totalFees = transactions.reduce(
    (sum, item) => sum + Number(item.citypass_amount || 0),
    0
  );

  return (
    <div style={{ padding: 20 }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: 20,
          padding: 12,
          borderRadius: 12,
          border: "none",
          background: "#111827",
          color: "white",
          cursor: "pointer",
        }}
      >
        Назад
      </button>

      <h1>
        {partner.company_name ||
          partner.full_name ||
          `Партнёр #${partner.id}`}
      </h1>

      <div>Telegram ID: {partner.telegram_id || "-"}</div>
      <div>Статус: {partner.status || "-"}</div>
      <div>Депозит: {partner.deposit_balance || 0}</div>
      <div>Бонусы: {partner.bonus_balance || 0}</div>

      <div>
        Всего доступно:{" "}
        {Number(partner.deposit_balance || 0) +
          Number(partner.bonus_balance || 0)}
      </div>

      <div style={{ marginTop: 20 }}>
        Оборот: {totalSales} VND
      </div>

      <div>Комиссии: {totalFees} VND</div>

      <h2 style={{ marginTop: 30 }}>История сделок</h2>

      {transactions.length === 0 && (
        <div>Сделок пока нет</div>
      )}

      {transactions.map((item, index) => (
        <div
          key={index}
          style={{
            background: "white",
            padding: 16,
            borderRadius: 14,
            marginBottom: 12,
          }}
        >
          <div>
            {new Date(item.created_at).toLocaleString("ru-RU")}
          </div>

          <div>Чек: {item.original_amount}</div>
          <div>К оплате клиентом: {item.final_amount}</div>
          <div>Комиссия платформы: {item.citypass_amount}</div>
        </div>
      ))}
    </div>
  );
}