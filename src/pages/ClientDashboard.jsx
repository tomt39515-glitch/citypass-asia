import React from "react";

export default function ClientDashboard({
  currentTab,
  transactions = [],
  role,
  setRole,
}) {
  const categories = [
    { icon: "🍽️", name: "Рестораны" },
    { icon: "🏨", name: "Отели" },
    { icon: "🏥", name: "Медицина" },
    { icon: "🛵", name: "Байки" },
    { icon: "✈️", name: "Экскурсии" },
    { icon: "🚕", name: "Такси" },
    { icon: "🛍️", name: "Магазины" },
    { icon: "💆", name: "SPA" },
  ];

  const partners = [
    {
      name: "Burger House",
      discount: "15%",
      city: "Дананг",
      image:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800",
    },
    {
      name: "Ocean SPA",
      discount: "20%",
      city: "Нячанг",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
    },
    {
      name: "Coffee Time",
      discount: "10%",
      city: "Хошимин",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    },
  ];

  return (
    <div
      style={{
        background: "#f4f7fb",
        minHeight: "100vh",
        paddingBottom: "100px",
      }}
    >
      {currentTab === "home" && (
        <>
          <div
            style={{
              background:
                "linear-gradient(135deg,#2563eb,#1d4ed8)",
              color: "#fff",
              padding: "30px",
              borderRadius: "0 0 30px 30px",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "32px",
              }}
            >
              🌴 CityPass Asia
            </h1>

            <p
              style={{
                marginTop: "10px",
                opacity: 0.9,
              }}
            >
              Ваш помощник в путешествиях
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "12px",
                  borderRadius: "14px",
                }}
              >
                🎁 127 партнёров
              </div>

              <div
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "12px",
                  borderRadius: "14px",
                }}
              >
                💸 До 50%
              </div>
            </div>
          </div>

          <div style={{ padding: "20px" }}>
            <input
              placeholder="🔍 Что вы ищете?"
              style={{
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius: "18px",
                background: "#fff",
                fontSize: "16px",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.05)",
              }}
            />

            <div
              style={{
                marginTop: "25px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "12px",
              }}
            >
              {categories.map((item) => (
                <div
                  key={item.name}
                  style={{
                    background: "#fff",
                    borderRadius: "18px",
                    padding: "14px",
                    textAlign: "center",
                    boxShadow:
                      "0 4px 20px rgba(0,0,0,0.05)",
                  }}
                >
                  <div style={{ fontSize: "26px" }}>
                    {item.icon}
                  </div>

                  <div
                    style={{
                      marginTop: "8px",
                      fontSize: "12px",
                    }}
                  >
                    {item.name}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                marginTop: "25px",
                background: "#fff",
                borderRadius: "24px",
                padding: "20px",
                boxShadow:
                  "0 4px 20px rgba(0,0,0,0.05)",
              }}
            >
              <h3>💳 Моя карта CityPass</h3>

              <p>Статус: Активен</p>

              <h2 style={{ color: "#2563eb" }}>
                Сэкономлено: 0 ₫
              </h2>
            </div>

            <h2
              style={{
                marginTop: "30px",
                marginBottom: "15px",
              }}
            >
              🔥 Популярные скидки
            </h2>

            <div
              style={{
                display: "flex",
                gap: "15px",
                overflowX: "auto",
              }}
            >
              {partners.map((item) => (
                <div
                  key={item.name}
                  style={{
                    minWidth: "260px",
                    background: "#fff",
                    borderRadius: "24px",
                    overflow: "hidden",
                    boxShadow:
                      "0 4px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  <img
                    src={item.image}
                    alt=""
                    style={{
                      width: "100%",
                      height: "170px",
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ padding: "16px" }}>
                    <h3>{item.name}</h3>

                    <p>📍 {item.city}</p>

                    <p
                      style={{
                        color: "#16a34a",
                        fontWeight: "700",
                      }}
                    >
                      🎁 Скидка {item.discount}
                    </p>

                    <button
                      style={{
                        width: "100%",
                        padding: "14px",
                        border: "none",
                        borderRadius: "14px",
                        background: "#2563eb",
                        color: "#fff",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      Получить скидку
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {currentTab === "history" && (
        <div style={{ padding: "20px" }}>
          <h2>📜 История покупок</h2>

          <div
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "20px",
              marginTop: "15px",
            }}
          >
            История появится после первых покупок
          </div>
        </div>
      )}

      {currentTab === "notifications" && (
        <div style={{ padding: "20px" }}>
          <h2>🔔 Уведомления</h2>
        </div>
      )}

      {currentTab === "profile" && (
        <div style={{ padding: "20px" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: "24px",
              padding: "25px",
            }}
          >
            <h2>👤 Виталий</h2>

            <p>⭐ Активный участник</p>

            <p>🏪 Партнёр подключён</p>

            <p>🤝 Агент подключён</p>

            <p>
              <strong>Текущая роль:</strong> {role}
            </p>

            <div
              style={{
                display: "grid",
                gap: "10px",
                marginTop: "20px",
              }}
            >
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
          </div>
        </div>
      )}
    </div>
  );
}