import React from "react";
import ClientQR from "./ClientQR";

export default function ClientDashboard({
  currentTab,
  transactions = [],
  role,
  setRole,
}) {
  return (
    <div>
      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "20px",
          marginBottom: "20px",
        }}
      >
        <h2>CityPass Asia</h2>
      </div>

      {currentTab === "home" && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          <h3>Главная</h3>

          {transactions.length === 0 ? (
            <p>Транзакций пока нет</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                #{tx.id} — {tx.amount}
              </div>
            ))
          )}
        </div>
      )}

      {currentTab === "qr" && <ClientQR />}

      {currentTab === "history" && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          <h3>История покупок</h3>
        </div>
      )}

      {currentTab === "notifications" && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          <h3>Уведомления</h3>
        </div>
      )}

      {currentTab === "profile" && (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "20px",
          }}
        >
          <h3>Профиль CityPass Asia</h3>

          <div
            style={{
              marginTop: "20px",
              padding: "15px",
              background: "#f8fafc",
              borderRadius: "15px",
            }}
          >
            <p>
              <strong>👤 Пользователь:</strong> Виталий
            </p>

            <p>
              <strong>🎖️ Статус:</strong> Активный участник
            </p>

            <p>
              <strong>🏪 Партнёр:</strong> Подключён
            </p>

            <p>
              <strong>🤝 Агент:</strong> Подключён
            </p>

            <p>
              <strong>⚙️ Текущая роль:</strong> {role}
            </p>
          </div>

          <h4 style={{ marginTop: "25px" }}>
            Переключение ролей
          </h4>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button onClick={() => setRole("client")}>
              👤 Клиент
            </button>

            <button onClick={() => setRole("partner")}>
              🏪 Партнёр
            </button>

            <button onClick={() => setRole("agent")}>
              🤝 Агент
            </button>

            <button onClick={() => setRole("admin")}>
              ⚙️ Администратор
            </button>
          </div>
        </div>
      )}
    </div>
  );
}