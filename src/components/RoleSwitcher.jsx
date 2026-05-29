import React from "react";

export default function RoleSwitcher({
  role,
  setRole,
  isPartner,
  isAgent,
  isAdmin,
}) {
  return (
    <div className="activity-card">
      <h3>Активная роль</h3>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginTop: "15px",
        }}
      >
        <button
          onClick={() => setRole("client")}
        >
          👤 Клиент
        </button>

        {isPartner && (
          <button
            onClick={() =>
              setRole("partner")
            }
          >
            🏪 Партнёр
          </button>
        )}

        {isAgent && (
          <button
            onClick={() =>
              setRole("agent")
            }
          >
            🤝 Агент
          </button>
        )}

        {isAdmin && (
          <button
            onClick={() =>
              setRole("admin")
            }
          >
            ⚙️ Админ
          </button>
        )}
      </div>
    </div>
  );
}