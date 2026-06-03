import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";

export default function PartnerHomeTab() {
  const [partnerInfo, setPartnerInfo] = useState(null);

  useEffect(() => {
    loadPartner();
  }, []);

  async function loadPartner() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId) return;

      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("telegram_id", telegramId)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setPartnerInfo(data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div
      style={{
        padding: "16px",
        background: "#F4F7FB",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Карточка партнёра */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#14B8A6,#0F766E)",
          borderRadius: "28px",
          padding: "24px",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            opacity: 0.9,
          }}
        >
          CITYPASS ASIA
        </div>

        <div
          style={{
            marginTop: "12px",
            fontSize: "28px",
            fontWeight: 700,
          }}
        >
          🏪 {partnerInfo?.business_name || "Партнёр"}
        </div>

        <div style={{ marginTop: "10px" }}>
          Партнёр CityPass Asia
        </div>

        <div
          style={{
            marginTop: "16px",
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "999px",
            background:
              "rgba(255,255,255,.15)",
          }}
        >
          Активный партнёр
        </div>
      </div>

      {/* Балансы */}
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
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            💳 Депозит
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "24px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            {Number(
              partnerInfo?.deposit_balance || 0
            ).toLocaleString()} ₫
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            🎁 Бонусный баланс
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "24px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            {Number(
              partnerInfo?.bonus_balance || 0
            ).toLocaleString()} ₫
          </div>
        </div>
      </div>

      {/* Статистика */}
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
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            👥 Клиентов сегодня
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "28px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            0
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            💰 Скидок сегодня
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "28px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            0 ₫
          </div>
        </div>
      </div>
    </div>
  );
}