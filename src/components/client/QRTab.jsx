export default function QRTab() {
  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f7fb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Premium Card */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#ff7b00,#ffb347)",
          borderRadius: "28px",
          padding: "24px",
          color: "#fff",
          boxShadow:
            "0 15px 35px rgba(255,123,0,.25)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                opacity: 0.9,
              }}
            >
              CityPass Asia
            </div>

            <h2
              style={{
                marginTop: "12px",
                marginBottom: "8px",
              }}
            >
              Виталий К.
            </h2>

            <div
              style={{
                display: "inline-block",
                background:
                  "rgba(255,255,255,.2)",
                padding: "8px 14px",
                borderRadius: "999px",
              }}
            >
              ⭐ Premium
            </div>
          </div>

          <div
            style={{
              fontSize: "48px",
            }}
          >
            🎫
          </div>
        </div>

        <div
          style={{
            marginTop: "30px",
            opacity: 0.9,
          }}
        >
          ID: CPA-458294
        </div>
      </div>

      {/* QR */}
      <div
        style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "24px",
          textAlign: "center",
          boxShadow:
            "0 5px 20px rgba(0,0,0,.05)",
        }}
      >
        <h2>Мой QR код</h2>

        <p
          style={{
            color: "#666",
          }}
        >
          Покажите QR партнёру для получения скидки
        </p>

        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=citypass-premium-user"
          alt="QR"
          style={{
            width: "100%",
            maxWidth: "280px",
            marginTop: "15px",
            borderRadius: "20px",
          }}
        />

        <div
          style={{
            marginTop: "20px",
            fontSize: "32px",
            fontWeight: "700",
            color: "#2563eb",
          }}
        >
          59 сек
        </div>

        <button
          style={{
            marginTop: "15px",
            background:
              "linear-gradient(135deg,#2563eb,#1d4ed8)",
            color: "#fff",
            border: "none",
            borderRadius: "16px",
            padding: "14px 24px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Обновить QR
        </button>
      </div>

      {/* Stats */}
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
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#777",
            }}
          >
            Сегодня
          </div>

          <h2
            style={{
              color: "#16a34a",
            }}
          >
            245 000 ₫
          </h2>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#777",
            }}
          >
            Всего скидок
          </div>

          <h2
            style={{
              color: "#ff7b00",
            }}
          >
            341
          </h2>
        </div>
      </div>

      {/* Recent */}
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "20px",
        }}
      >
        <h3>Последние скидки</h3>

        <div
          style={{
            marginTop: "15px",
          }}
        >
          🍔 Burger House — 120 000 ₫
        </div>

        <div
          style={{
            marginTop: "12px",
          }}
        >
          💆 Ocean SPA — 200 000 ₫
        </div>

        <div
          style={{
            marginTop: "12px",
          }}
        >
          🏨 Seaside Hotel — 350 000 ₫
        </div>
      </div>
    </div>
  );
}