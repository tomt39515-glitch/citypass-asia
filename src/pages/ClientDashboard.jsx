{currentTab === "qr" && (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    }}
  >
    {/* Карта пользователя */}
    <div
      style={{
        background:
          "linear-gradient(135deg,#ff7b00,#ffb347)",
        borderRadius: "24px",
        padding: "24px",
        color: "#fff",
        boxShadow: "0 10px 30px rgba(255,123,0,.25)",
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
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            CityPass Asia
          </div>

          <h2
            style={{
              margin: "8px 0",
            }}
          >
            Виталий К.
          </h2>

          <div
            style={{
              background: "rgba(255,255,255,.25)",
              display: "inline-block",
              padding: "6px 12px",
              borderRadius: "999px",
            }}
          >
            ⭐ Premium
          </div>
        </div>

        <div
          style={{
            fontSize: "42px",
          }}
        >
          🎫
        </div>
      </div>
    </div>

    {/* QR */}
    <div
      style={{
        background: "#fff",
        borderRadius: "24px",
        padding: "30px",
        textAlign: "center",
      }}
    >
      <h2>Мой QR</h2>

      <p
        style={{
          color: "#666",
        }}
      >
        Покажите QR партнёру
      </p>

      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=citypass-user"
          alt="QR"
        />
      </div>

      <div
        style={{
          color: "#2563eb",
          fontSize: "24px",
          fontWeight: "700",
        }}
      >
        54 сек
      </div>

      <button
        style={{
          marginTop: "15px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "14px",
          padding: "12px 24px",
          cursor: "pointer",
        }}
      >
        Обновить QR
      </button>
    </div>

    {/* Статистика */}
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
            color: "#666",
          }}
        >
          Сегодня сэкономлено
        </div>

        <h2
          style={{
            marginTop: "10px",
            color: "#ff7b00",
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
        }}
      >
        <div
          style={{
            color: "#666",
          }}
        >
          Использовано скидок
        </div>

        <h2
          style={{
            marginTop: "10px",
            color: "#16a34a",
          }}
        >
          341
        </h2>
      </div>
    </div>

    {/* Последние скидки */}
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
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
          marginTop: "10px",
        }}
      >
        🏨 Seaside Hotel — 350 000 ₫
      </div>

      <div
        style={{
          marginTop: "10px",
        }}
      >
        💆 Ocean SPA — 200 000 ₫
      </div>
    </div>
  </div>
)}