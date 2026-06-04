import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerDepositsTab() {
const [partner, setPartner] = useState(null);
const [logs, setLogs] = useState([]);
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

  const currentPartner = data[0];

  setPartner(currentPartner);

  const {
    data: logsData,
    error: logsError,
  } = await supabase
    .from("partner_balance_logs")
    .select("*")
    .eq("partner_id", currentPartner.id)
    .order("created_at", {
      ascending: false,
    });

  if (logsError) {
    throw logsError;
  }

  setLogs(logsData || []);
console.log("LOGS:", logsData);
console.log("PARTNER ID:", currentPartner.id);
} catch (err) {
  console.error(err);
  alert(err.message);
} finally {
  setLoading(false);
}


}

if (loading) {
return (
<div
style={{
padding: "16px",
}}
>
Загрузка... </div>
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
}}
>
<h2
style={{
marginTop: 0,
}}
>
Депозиты </h2>


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

    <div
      style={{
        marginTop: "24px",
      }}
    >
      <h3
        style={{
          marginBottom: "16px",
        }}
      >
        История операций
      </h3>

      {logs.length === 0 ? (
        <div
          style={{
            color: "#64748B",
          }}
        >
          Операций пока нет
        </div>
      ) : (
        logs.map((item) => (
          <div
            key={item.id}
            style={{
              background: "#F8FAFC",
              borderRadius: "16px",
              padding: "16px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontWeight: "700",
                color:
                  item.operation_type ===
                  "credit"
                    ? "#16A34A"
                    : "#DC2626",
              }}
            >
              {item.operation_type ===
              "credit"
                ? "➕ Пополнение"
                : "➖ Комиссия"}
            </div>

            <div
              style={{
                marginTop: "8px",
                fontSize: "20px",
                fontWeight: "600",
              }}
            >
              {Number(
                item.amount || 0
              ).toLocaleString()} ₫
            </div>

            <div
              style={{
                marginTop: "6px",
                color: "#64748B",
              }}
            >
              {item.description}
            </div>

            <div
              style={{
                marginTop: "6px",
                fontSize: "12px",
                color: "#94A3B8",
              }}
            >
              {new Date(
                item.created_at
              ).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</div>


);
}
