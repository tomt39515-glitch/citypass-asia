import React, { useState } from "react";
import QRScanner from "../components/QRScanner";

export default function PartnerDashboard() {
  const [showScanner, setShowScanner] =
    useState(false);

  const handleScanSuccess = (data) => {
    console.log("QR DATA:", data);

    alert(
      `Клиент найден: ${
        data.name || data.clientId
      }`
    );

    setShowScanner(false);
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
      {/* HEADER */}

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

      {/* KPI */}

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

      {/* SCANNER */}

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

      {/* QR SCANNER */}

      {showScanner && (
        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "20px",
          }}
        >
          <h3
            style={{
              marginTop: 0,
            }}
          >
            Сканирование QR
          </h3>

          <QRScanner
            onScanSuccess={
              handleScanSuccess
            }
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

      {/* WEEK STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            Сегодня
          </div>

          <div
            style={{
              marginTop: "8px",
              fontWeight: 700,
              fontSize: "20px",
            }}
          >
            24
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            Неделя
          </div>

          <div
            style={{
              marginTop: "8px",
              fontWeight: 700,
              fontSize: "20px",
            }}
          >
            173
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "18px",
            padding: "16px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "12px",
            }}
          >
            Месяц
          </div>

          <div
            style={{
              marginTop: "8px",
              fontWeight: 700,
              fontSize: "20px",
            }}
          >
            892
          </div>
        </div>
      </div>

      {/* CLIENTS */}

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "20px",
        }}
      >
        <h3
          style={{
            marginTop: 0,
          }}
        >
          Последние клиенты
        </h3>

        <div
          style={{
            padding: "12px",
            borderRadius: "14px",
            background: "#F8FAFC",
            marginTop: "12px",
          }}
        >
          👤 Виталий К.
          <div
            style={{
              color: "#64748B",
              marginTop: "4px",
            }}
          >
            Скидка 15% • 12:43
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            borderRadius: "14px",
            background: "#F8FAFC",
            marginTop: "12px",
          }}
        >
          👤 Иван П.
          <div
            style={{
              color: "#64748B",
              marginTop: "4px",
            }}
          >
            Скидка 10% • 13:05
          </div>
        </div>

        <div
          style={{
            padding: "12px",
            borderRadius: "14px",
            background: "#F8FAFC",
            marginTop: "12px",
          }}
        >
          👤 Анна С.
          <div
            style={{
              color: "#64748B",
              marginTop: "4px",
            }}
          >
            Скидка 20% • 14:11
          </div>
        </div>
      </div>
    </div>
  );
}