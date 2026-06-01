import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

function Transactions() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("partner_transactions_view")
        .select("*")
        .eq("partner_id", 1)
        .order("created_at", {
          ascending: false,
        });

      console.log("PARTNER DEALS:", data);
      console.log("PARTNER DEALS ERROR:", error);

      if (error) {
        console.error(error);
        setDeals([]);
        return;
      }

      setDeals(data || []);
    } catch (e) {
      console.error(e);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            marginBottom: "20px",
          }}
        >
          История сделок
        </h1>

        {loading ? (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            Загрузка...
          </div>
        ) : deals.length === 0 ? (
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "20px",
              textAlign: "center",
            }}
          >
            Сделок пока нет
          </div>
        ) : (
          deals.map((deal) => (
            <div
              key={deal.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "20px",
                marginBottom: "16px",
                boxShadow:
                  "0 10px 25px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  fontWeight: "700",
                  color: "#2563eb",
                  marginBottom: "10px",
                }}
              >
                Сделка #{deal.id}
              </div>

              <div>
                Клиент:{" "}
                <b>
                  {deal.client_name ||
                    "Неизвестный клиент"}
                </b>
              </div>

              <div>
                Telegram ID:{" "}
                {deal.telegram_id}
              </div>

              <div>
                Чек:{" "}
                {Number(
                  deal.original_amount || 0
                ).toLocaleString()}{" "}
                VND
              </div>

              <div>
                Скидка клиенту:{" "}
                {Number(
                  deal.client_discount_amount || 0
                ).toLocaleString()}{" "}
                VND
              </div>

              <div>
                Комиссия CityPass:{" "}
                {Number(
                  deal.citypass_amount || 0
                ).toLocaleString()}{" "}
                VND
              </div>

              <div>
                Клиент оплатил:{" "}
                <b>
                  {Number(
                    deal.final_amount || 0
                  ).toLocaleString()}{" "}
                  VND
                </b>
              </div>

              <div>
                Статус: {deal.status}
              </div>

              <div
                style={{
                  marginTop: "10px",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                {new Date(
                  deal.created_at
                ).toLocaleString("ru-RU")}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Transactions;