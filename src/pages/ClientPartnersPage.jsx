import React, { useEffect, useState } from "react";

const SUPABASE_URL = "https://doswzyuumcwxjmltcgeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_5_sw0Rk7sPg-SMTgI1aTkA_Vb5QAZRP";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export default function ClientPartnersPage({ onBack }) {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadPartners() {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/partners?status=eq.active&select=*`,
        {
          headers,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Ошибка загрузки");
      }

      const data = await response.json();

      setPartners(data || []);
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPartners();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        Загрузка партнёров...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 20,
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <button
        onClick={onBack}
        style={{
          background: "#111827",
          color: "white",
          border: "none",
          padding: "12px 18px",
          borderRadius: 14,
          marginBottom: 20,
          cursor: "pointer",
        }}
      >
        Назад
      </button>

      <h1
        style={{
          marginBottom: 20,
        }}
      >
        Партнёры CityPass
      </h1>

      {partners.length === 0 && (
        <div>Активных партнёров пока нет</div>
      )}

      {partners.map((partner) => (
        <div
          key={partner.id}
          style={{
            background: "white",
            padding: 20,
            borderRadius: 20,
            marginBottom: 16,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2 style={{ margin: 0 }}>
            {partner.company_name ||
              partner.name ||
              `Партнёр #${partner.id}`}
          </h2>

          <div style={{ marginTop: 10 }}>
            Категория: {partner.category || "Не указана"}
          </div>

          <div style={{ marginTop: 6 }}>
            Адрес: {partner.address || "Не указан"}
          </div>

          <div style={{ marginTop: 6 }}>
            Скидка: {partner.discount_percent || 10}%
          </div>

          <div style={{ marginTop: 6 }}>
            {partner.description || ""}
          </div>
        </div>
      ))}
    </div>
  );
}