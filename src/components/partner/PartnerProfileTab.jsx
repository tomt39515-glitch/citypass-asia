import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerProfileTab({
  onOpenTopup,
}) {
  const [partner, setPartner] = useState(null);

  useEffect(() => {
    loadPartner();
  }, []);

  async function loadPartner() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      alert(`Telegram ID: ${telegramId}`);
      console.log("TELEGRAM ID:", telegramId);

      if (!telegramId) {
        alert("Telegram ID не найден");
        return;
      }

      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("telegram_id", Number(telegramId))
        .maybeSingle();

      console.log("PARTNER QUERY RESULT:", data);
      console.log("PARTNER QUERY ERROR:", error);

      if (error) {
        console.error(error);
        alert(error.message);
        return;
      }

      if (!data) {
        alert(
          `Партнёр не найден для Telegram ID ${telegramId}`
        );
        return;
      }

      setPartner(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
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
        }}
      >
        <h2
          style={{
            marginTop: 0,
            marginBottom: "20px",
          }}
        >
          Профиль партнёра
        </h2>

        <div style={{ marginBottom: "12px" }}>
          <b>Название:</b>
          <br />
          {partner?.business_name || "-"}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <b>Телефон:</b>
          <br />
          {partner?.phone || "-"}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <b>Адрес:</b>
          <br />
          {partner?.address || "-"}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <b>Категория:</b>
          <br />
          {partner?.category || "-"}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <b>Депозит:</b>
          <br />
          {Number(
            partner?.deposit_balance || 0
          ).toLocaleString()} ₫
        </div>

        <button
          onClick={() => {
            console.log(
              "BUTTON CLICK. PARTNER:",
              partner
            );

            if (!partner) {
              alert(
                "Партнёр не найден. Проверьте таблицу partners."
              );
              return;
            }

            alert(
              `Открываем пополнение для партнёра ID ${partner.id}`
            );

            onOpenTopup?.(partner);
          }}
          disabled={!partner}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
            border: "none",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg,#14B8A6,#0D9488)",
            color: "#fff",
            fontWeight: 600,
            cursor: partner
              ? "pointer"
              : "not-allowed",
            opacity: partner ? 1 : 0.5,
          }}
        >
          Пополнить депозит
        </button>

        <div style={{ marginBottom: "12px" }}>
          <b>Бонусный баланс:</b>
          <br />
          {Number(
            partner?.bonus_balance || 0
          ).toLocaleString()} ₫
        </div>

        <div>
          <b>Статус:</b>
          <br />
          Активный партнёр
        </div>
      </div>
    </div>
  );
}