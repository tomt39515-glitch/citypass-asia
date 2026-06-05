import React from "react";

export default function PartnerProductsTab() {
  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "24px",
        }}
      >
        <h2>🛍️ Товары и услуги</h2>

        <p>
          Здесь будут отображаться товары и услуги партнёра.
        </p>

        <button
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg,#14B8A6,#0D9488)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Добавить товар
        </button>
      </div>
    </div>
  );
}