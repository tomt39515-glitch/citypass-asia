export default function PartnerCard({
  name,
  discount,
  category,
  icon,
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 4px 15px rgba(0,0,0,.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3>
            {icon} {name}
          </h3>

          <div
            style={{
              color: "#666",
            }}
          >
            {category}
          </div>
        </div>

        <div
          style={{
            background: "#16a34a",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: "12px",
            fontWeight: "700",
          }}
        >
          -{discount}
        </div>
      </div>

      <button
        style={{
          marginTop: "15px",
          width: "100%",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          padding: "12px",
          cursor: "pointer",
        }}
      >
        Подробнее
      </button>
    </div>
  );
}