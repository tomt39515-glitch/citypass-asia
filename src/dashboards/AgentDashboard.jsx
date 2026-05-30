import React from "react";

export default function AgentDashboard({ currentTab }) {
  if (currentTab === "dashboard") {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Кабинет агента</h1>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "20px",
            marginTop: "20px",
          }}
        >
          <h2>Общий доход</h2>
          <h3>$8420</h3>
        </div>
      </div>
    );
  }

  if (currentTab === "partners") {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Партнёры агента</h1>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "20px",
            marginTop: "20px",
          }}
        >
          <p>Подключено партнёров: 24</p>
        </div>
      </div>
    );
  }

  if (currentTab === "earnings") {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Доход агента</h1>

        <div
          style={{
            background: "#fff",
            padding: "20px",
            borderRadius: "20px",
            marginTop: "20px",
          }}
        >
          <p>Доход за месяц: $2140</p>
          <p>Доход за всё время: $8420</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Кабинет агента</h1>
    </div>
  );
}