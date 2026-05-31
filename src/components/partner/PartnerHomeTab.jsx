import React, { useState } from "react";
import QRScanner from "../components/QRScanner";
import { supabase } from "../supabase";

export default function PartnerDashboard() {
  const [showScanner, setShowScanner] =
    useState(false);

  const [selectedClient, setSelectedClient] =
    useState(null);

  const handleScanSuccess = async (data) => {
    try {
      console.log("QR DATA:", data);

      const {
        data: qrData,
        error: qrError,
      } = await supabase
        .from("active_qr_tokens")
        .select("*")
        .eq("token", data.token)
        .single();

      if (qrError || !qrData) {
        alert("❌ QR код не найден");
        return;
      }

      const {
        data: client,
        error: clientError,
      } = await supabase
        .from("clients")
        .select("*")
        .eq("id", qrData.client_id)
        .single();

      if (clientError || !client) {
        alert("❌ Клиент не найден");
        return;
      }

      setSelectedClient(client);
      setShowScanner(false);
    } catch (error) {
      console.error(error);
      alert("❌ Ошибка проверки QR");
    }
  };

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
          🏪 Burger House
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
            24
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
            💸 Скидок сегодня
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "28px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            1 250 000 ₫
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "24px",
        }}
      >
        <button
          onClick={() =>
            setShowScanner(true)
          }
          style={{
            width: "100%",
            border: "none",
            borderRadius: "18px",
            padding: "18px",
            background:
              "linear-gradient(135deg,#14B8A6,#0D9488)",
            color: "#fff",
            fontSize: "18px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          📷 Сканировать QR
        </button>
      </div>

      {showScanner && (
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "20px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            Сканирование QR
          </h3>

          <QRScanner
            onScanSuccess={handleScanSuccess}
          />

          <button
            onClick={() =>
              setShowScanner(false)
            }
            style={{
              marginTop: "16px",
              width: "100%",
              border: "none",
              borderRadius: "16px",
              padding: "14px",
              background: "#EF4444",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Закрыть сканер
          </button>
        </div>
      )}

      {selectedClient && (
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "20px",
          }}
        >
          <h3 style={{ marginTop: 0 }}>
            👤 {selectedClient.full_name}
          </h3>

          <div
            style={{
              padding: "16px",
              background: "#F8FAFC",
              borderRadius: "16px",
              marginBottom: "16px",
            }}
          >
            <div>
              ID: {selectedClient.id}
            </div>

            <div
              style={{
                marginTop: "8px",
              }}
            >
              💰 Бонусы:{" "}
              {selectedClient.bonus_balance}
            </div>

            <div
              style={{
                marginTop: "8px",
              }}
            >
              💳 Потрачено:{" "}
              {selectedClient.total_spent}
            </div>

            <div
              style={{
                marginTop: "8px",
              }}
            >
              📱 Telegram:{" "}
              {selectedClient.telegram_id}
            </div>
          </div>

          <button
            onClick={() => {
              alert(
                `✅ Скидка применена для ${selectedClient.full_name}`
              );

              setSelectedClient(null);
            }}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "16px",
              padding: "16px",
              background:
                "linear-gradient(135deg,#14B8A6,#0D9488)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Подтвердить скидку
          </button>
        </div>
      )}
    </div>
  );
}