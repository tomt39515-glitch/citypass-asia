export default function HomeTab() {
  const categories = [
    "Рестораны",
    "Отели",
    "Медицина",
    "Магазины",
  ];

  return (
    <div
      style={{
        background: "#F4F7FB",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: "16px",
          paddingBottom: "90px",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
        }}
      >
        {/* LOGO */}

        <div>
          <h1
            style={{
              margin: 0,
              color: "#14B8A6",
              fontSize: "30px",
              fontWeight: 800,
            }}
          >
            CityPass Asia
          </h1>

          <div
            style={{
              color: "#64748B",
              marginTop: "4px",
            }}
          >
            Клуб привилегий и скидок
          </div>
        </div>

        {/* MEMBER CARD */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#14B8A6,#0F766E)",
            borderRadius: "28px",
            padding: "22px",
            color: "#fff",
          }}
        >
          <div
            style={{
              opacity: 0.9,
              fontSize: "14px",
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
            CLUB MEMBER
          </div>

          <div
            style={{
              marginTop: "12px",
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,.18)",
            }}
          >
            Активный участник
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "18px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "#fff",
                color: "#0F172A",
                padding: "10px 14px",
                borderRadius: "14px",
                fontWeight: 600,
              }}
            >
              127 партнёров
            </div>

            <div
              style={{
                background: "#fff",
                color: "#0F172A",
                padding: "10px 14px",
                borderRadius: "14px",
                fontWeight: 600,
              }}
            >
              До 50% скидок
            </div>
          </div>
        </div>

        {/* QR BUTTON */}

        <button
          style={{
            width: "100%",
            border: "none",
            borderRadius: "20px",
            padding: "18px",
            background:
              "linear-gradient(135deg,#14B8A6,#0D9488)",
            color: "#fff",
            fontSize: "18px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Мой QR-код
        </button>

        {/* SEARCH */}

        <input
          placeholder="Поиск партнёров..."
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "18px",
            border: "none",
            fontSize: "15px",
            boxSizing: "border-box",
            background: "#fff",
            boxShadow:
              "0 5px 15px rgba(15,23,42,.05)",
          }}
        />

        {/* CATEGORIES */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {categories.map((item) => (
            <div
              key={item}
              style={{
                background: "#fff",
                borderRadius: "18px",
                padding: "18px",
                textAlign: "center",
                fontWeight: 600,
                color: "#0F172A",
                boxShadow:
                  "0 5px 15px rgba(15,23,42,.04)",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* SAVINGS */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#14B8A6,#0F766E)",
            borderRadius: "22px",
            padding: "20px",
            color: "#fff",
          }}
        >
          <div
            style={{
              opacity: 0.9,
            }}
          >
            Экономия участников сегодня
          </div>

          <h2
            style={{
              marginTop: "10px",
              marginBottom: 0,
              fontSize: "28px",
            }}
          >
            12 458 000 ₫
          </h2>
        </div>
      </div>
    </div>
  );
}