import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Transactions() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  const TELEGRAM_ID = "8052071718";

  useEffect(() => {
    loadDeals();
  }, []);

  async function loadDeals() {
    try {
      setLoading(true);

      const { data: partner, error: partnerError } =
        await supabase
          .from("partners")
          .select("id")
          .eq("telegram_id", TELEGRAM_ID)
          .single();

      if (partnerError || !partner) {
        console.error(partnerError);
        setDeals([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("partner_id", partner.id)
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(error);
        setDeals([]);
        setLoading(false);
        return;
      }

      setDeals(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setDeals([]);
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
              background: "#fff",
              padding: "20px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",
            }}
          >
            Загрузка...
          </div>
        ) : deals.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: "20px",
              borderRadius: "20px",
              textAlign: "center",
              boxShadow:
                "0 10px 25px rgba(0,0,0,0.08)",
            }}
          >
            Сделок пока нет
          </div>
        ) : (
          deals.map((deal) => (
            <div
              key={deal.id}
              style={{
                background: "#fff",
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
                  marginBottom: "10px",
                  color: "#2563eb",
                  fontSize: "18px",
                }}
              >
                Сделка #{deal.id}
              </div>

              <div>
                Чек:{" "}
                {Number(
                  deal.original_amount || 0
                ).toLocaleString()}{" "}
                донгов
              </div>

              <div>
                Скидка клиенту:{" "}
                {Number(
                  deal.client_discount_percent || 0
                )}
                %
              </div>

              <div>
                Комиссия CityPass:{" "}
                {Number(
                  deal.citypass_amount || 0
                ).toLocaleString()}{" "}
                донгов
              </div>

              <div>
                Клиент оплатил:{" "}
                {Number(
                  deal.final_amount || 0
                ).toLocaleString()}{" "}
                донгов
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