import React from "react";

export default function ClientDashboard({
  currentTab,
  transactions = [],
  role,
  setRole,
}) {
  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f7fb",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {currentTab === "home" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <div
            style={{
              background:
                "linear-gradient(135deg,#ff7b00,#ffb347)",
              borderRadius: "24px",
              padding: "24px",
              color: "#fff",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              CityPass Asia
            </h1>

            <p
              style={{
                marginTop: "10px",
                opacity: 0.9,
              }}
            >
              Ваш помощник во Вьетнаме
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "20px",
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,.2)",
                  padding: "10px 15px",
                  borderRadius: "12px",
                }}
              >
                🏪 127 партнёров
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,.2)",
                  padding: "10px 15px",
                  borderRadius: "12px",
                }}
              >
                🎁 До 50% скидок
              </div>
            </div>
          </div>

          <input
            placeholder="Поиск ресторанов, отелей, услуг..."
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "16px",
              border: "1px solid #eee",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            {[
              "🍔 Рестораны",
              "🏨 Отели",
              "🏥 Медицина",
              "💆 SPA",
              "🚕 Такси",
              "🛍 Магазины",
              "🏝 Экскурсии",
              "🛵 Байки",
            ].map((item) => (
              <div
                key={item}
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "20px",
                  textAlign: "center",
                  boxShadow:
                    "0 5px 20px rgba(0,0,0,.05)",
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <div
            style={{
              background:
                "linear-gradient(135deg,#ffb800,#ff7b00)",
              borderRadius: "24px",
              padding: "20px",
              color: "#fff",
            }}
          >
            <div>Сегодня сэкономлено</div>

            <h2
              style={{
                marginTop: "10px",
              }}
            >
              12 458 000 ₫
            </h2>
          </div>

          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "20px",
            }}
          >
            <h3>Популярные предложения</h3>

            <div style={{ marginTop: "15px" }}>
              🍔 Burger House — скидка 15%
            </div>

            <div style={{ marginTop: "10px" }}>
              💆 Ocean SPA — скидка 20%
            </div>

            <div style={{ marginTop: "10px" }}>
              ☕ Coffee Time — скидка 10%
            </div>
          </div>
        </div>
      )}

      {currentTab === "qr" && (
        <div>
          <h2>Мой QR</h2>
          <p>QR экран работает</p>
        </div>
      )}

      {currentTab === "history" && (
        <div>
          <h2>История</h2>
          <p>История операций</p>
        </div>
      )}

      {currentTab === "notifications" && (
        <div>
          <h2>Уведомления</h2>
          <p>Уведомлений пока нет</p>
        </div>
      )}

      {currentTab === "profile" && (
        <div>
          <h2>Профиль</h2>

          <button onClick={() => setRole("client")}>
            Клиент
          </button>

          <button onClick={() => setRole("partner")}>
            Партнёр
          </button>

          <button onClick={() => setRole("agent")}>
            Агент
          </button>

          <button onClick={() => setRole("admin")}>
            Администратор
          </button>
        </div>
      )}
    </div>
  );
}