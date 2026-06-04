import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerDepositsTab() {
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartner();
  }, []);

  async function loadPartner() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId) {
        alert("Telegram ID не найден");
        return;
      }

      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("telegram_id", Number(telegramId))
        .order("id", { ascending: false })
        .limit(1);

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        alert("Партнёр не найден");
        return;
      }

      setPartner(data[0]);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "16px" }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "16px",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "24px",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          Депозиты
        </h2>

        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "20px",
            background:
              "linear-gradient(135deg,#14B8A6,#0F766E)",
            color: "#fff",
          }}
        >
          <div
            style={{
              opacity: 0.9,
              fontSize: "14px",
            }}
          >
            Текущий депозит
          </div>

          <div
            style={{
              marginTop: "10px",
              fontSize: "32px",
              fontWeight: "700",
            }}
          >
            {Number(
              partner?.deposit_balance || 0
            ).toLocaleString()} ₫
          </div>
        </div>
      </div>
    </div>
  );
}