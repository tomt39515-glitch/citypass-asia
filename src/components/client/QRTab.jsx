export default function QRTab() {
  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg,#2563eb,#1d4ed8)",
          borderRadius: "24px",
          padding: "24px",
          color: "#fff",
        }}
      >
        <h2>Виталий К.</h2>
        <div>⭐ Premium</div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "24px",
          marginTop: "20px",
          textAlign: "center",
        }}
      >
        <h2>Мой QR</h2>
      </div>
    </div>
  );
}