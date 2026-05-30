export default function ProfileTab({
  setRole,
}) {
  return (
    <div
      style={{
        padding: "16px",
      }}
    >
      <h2>👤 Профиль</h2>

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
  );
}