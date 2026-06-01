import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function HistoryTab() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSaved, setTotalSaved] = useState(0);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId) {
        setLoading(false);
        return;
      }

      const { data: client } = await supabase
        .from("clients")
        .select("*")
        .eq("telegram_id", String(telegramId))
        .single();

      if (!client) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("client_transactions_view")
        .select("*")
        .eq("user_id", client.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setHistory(data || []);

      const saved = (data || []).reduce(
        (sum, item) =>
          sum +
          Number(
            item.client_discount_amount || 0
          ),
        0
      );

      setTotalSaved(saved);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
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
            opacity: 0.9,
          }}
        >
          Всего сэкономлено
        </div>

        <div
          style={{
            fontSize: "34px",
            fontWeight: 800,
            marginTop: "10px",
          }}
        >
          {totalSaved.toLocaleString()} ₫
        </div>

        <div
          style={{
            marginTop: "10px",
            opacity: 0.85,
          }}
        >
          {history.length} использованных скидок
        </div>
      </div>

      <h2
        style={{
          margin: 0,
          color: "#0F172A",
        }}
      >
        История операций
      </h2>

      {loading && (
        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "22px",
          }}
        >
          Загрузка...
        </div>
      )}

      {!loading &&
        history.length === 0 && (
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "22px",
            }}
          >
            История пока пуста
          </div>
        )}

      {history.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#fff",
            borderRadius: "22px",
            padding: "18px",
            boxShadow:
              "0 5px 15px rgba(15,23,42,.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "16px",
                  color: "#0F172A",
                }}
              >
                {item.partner_name}
              </div>

              <div
                style={{
                  color: "#64748B",
                  marginTop: "4px",
                  fontSize: "13px",
                }}
              >
                {new Date(
                  item.created_at
                ).toLocaleString("ru-RU")}
              </div>
            </div>

            <div
              style={{
                background: "#ECFDF5",
                color: "#14B8A6",
                padding: "8px 12px",
                borderRadius: "999px",
                fontWeight: 700,
              }}
            >
              -
              {Number(
                item.client_discount_amount || 0
              ).toLocaleString()}{" "}
              ₫
            </div>
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "flex",
              justifyContent:
                "space-between",
            }}
          >
            <div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                }}
              >
                Сумма покупки
              </div>

              <div
                style={{
                  fontWeight: 600,
                }}
              >
                {Number(
                  item.original_amount || 0
                ).toLocaleString()}{" "}
                ₫
              </div>
            </div>

            <div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                }}
              >
                Скидка
              </div>

              <div
                style={{
                  fontWeight: 700,
                  color: "#14B8A6",
                }}
              >
                {item.client_discount_percent}%
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "10px",
              fontWeight: 700,
            }}
          >
            Оплачено:{" "}
            {Number(
              item.final_amount || 0
            ).toLocaleString()}{" "}
            ₫
          </div>
        </div>
      ))}
    </div>
  );
}