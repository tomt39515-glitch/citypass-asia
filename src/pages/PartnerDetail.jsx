export default function PartnerDetails() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <img
        src="https://picsum.photos/600/300"
        alt="partner"
        style={{
          width: "100%",
          borderRadius: "20px",
        }}
      />

      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <h2>Burger House</h2>

        <p>🍔 Лучшие бургеры в Нячанге</p>

        <p>📍 Nha Trang Center</p>

        <p>📞 +84 901 234 567</p>

        <div
          style={{
            background: "#16a34a",
            color: "#fff",
            display: "inline-block",
            padding: "10px 16px",
            borderRadius: "12px",
            fontWeight: "700",
          }}
        >
          Скидка 15%
        </div>

        <button
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "14px",
            border: "none",
            borderRadius: "14px",
            background: "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Получить скидку
        </button>
      </div>
    </div>
  );
}