import { useState } from "react";

const SUPABASE_URL = "https://doswzyuumcwxjmltcgeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_5_sw0Rk7sPg-SMTgI1aTkA_Vb5QAZRP";

const defaultHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

async function safeFetch(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Supabase error");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export default function PartnerApplyPage({ telegramUser, onSuccess }) {
  const [form, setForm] = useState({
    business_name: "",
    category: "",
    contact_name: "",
    phone: "",
    address: "",
    description: "",
    discount_percent: 10,
  });

  const [loading, setLoading] = useState(false);

  const updateField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  async function submitApplication() {
    try {
      if (!telegramUser?.id) {
        throw new Error("Telegram user not found");
      }

      if (
        !form.business_name ||
        !form.category ||
        !form.contact_name
      ) {
        throw new Error("Заполните обязательные поля");
      }

      setLoading(true);

      await safeFetch(
        `${SUPABASE_URL}/rest/v1/partner_applications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify([
            {
              telegram_id: telegramUser.id,
              telegram_username: telegramUser.username || "",
              business_name: form.business_name,
              category: form.category,
              contact_name: form.contact_name,
              phone: form.phone,
              address: form.address,
              description: form.description,
              discount_percent: form.discount_percent,
            },
          ]),
        }
      );

      onSuccess();
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          maxWidth: 500,
          margin: "0 auto",
          background: "white",
          padding: 24,
          borderRadius: 24,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1>Стать партнёром CityPass</h1>

        <input
          placeholder="Название бизнеса"
          value={form.business_name}
          onChange={(e) => updateField("business_name", e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Категория"
          value={form.category}
          onChange={(e) => updateField("category", e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Контактное лицо"
          value={form.contact_name}
          onChange={(e) => updateField("contact_name", e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Телефон"
          value={form.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          style={inputStyle}
        />

        <input
          placeholder="Адрес"
          value={form.address}
          onChange={(e) => updateField("address", e.target.value)}
          style={inputStyle}
        />

        <textarea
          placeholder="Описание"
          value={form.description}
          onChange={(e) => updateField("description", e.target.value)}
          style={{
            ...inputStyle,
            minHeight: 120,
          }}
        />

        <button
          onClick={submitApplication}
          disabled={loading}
          style={{
            width: "100%",
            padding: 16,
            border: "none",
            borderRadius: 16,
            background: "#111827",
            color: "white",
            cursor: "pointer",
          }}
        >
          {loading ? "Отправка..." : "Подать заявку"}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 14,
  marginBottom: 14,
  borderRadius: 14,
  border: "1px solid #ddd",
  boxSizing: "border-box",
};