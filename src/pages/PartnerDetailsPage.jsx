import React, { useEffect, useState } from "react";

const SUPABASE_URL = "https://doswzyuumcwxjmltcgeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_5_sw0Rk7sPg-SMTgI1aTkA_Vb5QAZRP";

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
};

export default function PartnerDetailsPage({
  partner,
  onBack,
}) {
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
    if (!partner?.telegram_id) {
      setTransactions([]);
      return;
    }

    try {
      const partnerData = await safeFetch(
        `${SUPABASE_URL}/rest/v1/partners?telegram_id=eq.${partner.telegram_id}&select=id`
      );

      if (!partnerData?.length) {
        setTransactions([]);
        return;
      }

      const realPartnerId = partnerData[0].id;

      const data = await safeFetch(
        `${SUPABASE_URL}/rest/v1/transactions?partner_id=eq.${realPartnerId}&select=original_amount,client_discount_amount,citypass_amount,final_amount,created_at&order=created_at.desc`
      );

      setTransactions(data || []);
    } catch (error) {
      console.error(
        "Ошибка загрузки транзакций:",
        error
      );

      setTransactions([]);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, [partner]);

  if (!partner) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={onBack}>
          Назад
        </button>

        <div style={{ marginTop: 20 }}>
          Загрузка партнёра...
        </div>
      </div>
    );
  }

  const totalSales = transactions.reduce(
    (sum, item) =>
      sum + Number(item.original_amount || 0),
    0
  );

  const totalFees = transactions.reduce(
    (sum, item) =>
      sum + Number(item.citypass_amount || 0),
    0
  );

  const totalDiscounts = transactions.reduce(
    (sum, item) =>
      sum +
      Number(
        item.client_discount_amount || 0
      ),
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
        {partner.business_name ||
          `Партнёр #${partner.id}`}
      </h1>

      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 14,
          marginBottom: 20,
        }}
      >
        <div>
          <strong>Telegram ID:</strong>{" "}
          {partner.telegram_id || "-"}
        </div>

        <div>
          <strong>
            Контактное лицо:
          </strong>{" "}
          {partner.contact_name || "-"}
        </div>

        <div>
          <strong>Телефон:</strong>{" "}
          {partner.phone || "-"}
        </div>

        <div>
          <strong>Адрес:</strong>{" "}
          {partner.address || "-"}
        </div>

        <div>
          <strong>Категория:</strong>{" "}
          {partner.category || "-"}
        </div>

        <div>
          <strong>Скидка:</strong>{" "}
          {partner.discount_percent || 0}%
        </div>

        <div>
          <strong>Статус:</strong>{" "}
          {partner.status || "-"}
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Описание:</strong>
        </div>

        <div>
          {partner.description ||
            "Описание отсутствует"}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 14,
          marginBottom: 20,
        }}
      >
        <h2>Статистика</h2>

        <div>
          Оборот: {totalSales} VND
        </div>

        <div>
          Скидки клиентам:{" "}
          {totalDiscounts} VND
        </div>

        <div>
          Комиссии CityPass:{" "}
          {totalFees} VND
        </div>

        <div>
          Транзакций:{" "}
          {transactions.length}
        </div>
      </div>

      <h2>История сделок</h2>

      {transactions.length === 0 && (
        <div>Сделок пока нет</div>
      )}

      {transactions.map(
        (item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              padding: 16,
              borderRadius: 14,
              marginBottom: 12,
            }}
          >
            <div>
              {new Date(
                item.created_at
              ).toLocaleString("ru-RU")}
            </div>

            <div>
              Сумма покупки:{" "}
              {item.original_amount || 0}
            </div>

            <div>
              Скидка клиенту:{" "}
              {item.client_discount_amount ||
                0}
            </div>

            <div>
              К оплате:{" "}
              {item.final_amount || 0}
            </div>

            <div>
              Комиссия CityPass:{" "}
              {item.citypass_amount || 0}
            </div>
          </div>
        )
      )}
    </div>
  );
}