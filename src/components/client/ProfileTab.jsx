export default function ProfileTab({
  role,
  setRole,
}) {
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
      <div
        style={{
          background:
            "linear-gradient(135deg,#ff7b00,#ffb347)",
          borderRadius: "28px",
          padding: "24px",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              background: "#fff",
              color: "#ff7b00",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "700",
            }}
          >
            В
          </div>

          <div>
            <h2 style={{ margin: 0 }}>
              Виталий К.
            </h2>

            <div
              style={{
                marginTop: "8px",
              }}
            >
              ⭐ Premium
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "20px",
        }}
      >
        <h3>Смена роли</h3>

        <div
          style={{
            display: "grid",
            gap: "10px",
            marginTop: "15px",
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

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "20px",
        }}
      >
        <h3>Настройки</h3>

        <p>🌐 Язык</p>
        <p>🔔 Уведомления</p>
        <p>🔒 Безопасность</p>
        <p>💳 Подписка Premium</p>
        <p>📞 Поддержка</p>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "20px",
        }}
      >
        <h3>Статистика</h3>

        <p>Скидок использовано: 341</p>
        <p>Экономия: 12 458 000 ₫</p>
        <p>Партнёров рядом: 127</p>
      </div>
    </div>
  );
}