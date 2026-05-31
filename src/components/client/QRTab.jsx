export default function QRTab() {
  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        padding: "16px",
        paddingBottom: "100px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* CARD */}

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
            fontSize: "26px",
            fontWeight: 700,
          }}
        >
          Участник клуба
        </div>

        <div
          style={{
            marginTop: "12px",
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "999px",
            background:
              "rgba(255,255,255,.15)",
          }}
        >
          Активный статус
        </div>

        <div
          style={{
            marginTop: "28px",
            opacity: 0.85,
          }}
        >
          ID: CPA-000001
        </div>
      </div>

      {/* QR */}

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "28px",
          padding: "24px",
          textAlign: "center",
          boxShadow:
            "0 10px 25px rgba(15,23,42,.05)",
        }}
      >
        <h2
          style={{
            marginTop: 0,
            color: "#0F172A",
          }}
        >
          Мой QR-код
        </h2>

        <div
          style={{
            color: "#64748B",
            marginBottom: "20px",
          }}
        >
          Покажите код партнёру для получения скидки
        </div>

        <div
          style={{
            width: "280px",
            height: "280px",
            margin: "0 auto",
            background: "#F8FAFC",
            borderRadius: "24px",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#94A3B8",
            fontWeight: 600,
          }}
        >
          QR CODE
        </div>

        <button
          style={{
            marginTop: "20px",
            width: "100%",
            border: "none",
            borderRadius: "18px",
            padding: "16px",
            background:
              "linear-gradient(135deg,#14B8A6,#0D9488)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Обновить QR
        </button>
      </div>

      {/* STATS */}

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
            padding: "18px",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Сегодня сэкономлено
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "24px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            245 000 ₫
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "18px",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Получено скидок
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "24px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            341
          </div>
        </div>
      </div>

      {/* HISTORY */}

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
            color: "#0F172A",
          }}
        >
          Последние операции
        </h3>

        <div style={{ padding: "12px 0" }}>
          Burger House — 120 000 ₫
        </div>

        <div style={{ padding: "12px 0" }}>
          Ocean SPA — 200 000 ₫
        </div>

        <div style={{ padding: "12px 0" }}>
          Seaside Hotel — 350 000 ₫
        </div>
      </div>
    </div>
  );
}