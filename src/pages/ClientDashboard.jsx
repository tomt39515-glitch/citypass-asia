import React from "react";

export default function ClientDashboard({
  currentTab,
  transactions = [],
  role,
  setRole,
}) {
  return (
    <div style={{ padding: "20px" }}>
      <h1>CityPass Asia</h1>

      {currentTab === "home" && (
        <div>
          <h2>Главная</h2>
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
        </div>
      )}

      {currentTab === "notifications" && (
        <div>
          <h2>Уведомления</h2>
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