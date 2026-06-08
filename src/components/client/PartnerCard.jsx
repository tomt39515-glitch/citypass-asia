export default function PartnerCard({
  name,
  discount,
  category,
  icon,
  image,
  onOpen,
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

    {image && (
      <img
        src={image}
        alt={name}
        style={{
          width: "100%",
          height: 180,
          objectFit: "cover",
          borderRadius: "16px",
          marginBottom: "16px",
        }}
      />
    )}

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
        <div>
          <h3 style={{ margin: 0 }}>
            {icon} {name}
          </h3>

          <div
            style={{
              color: "#666",
              marginTop: "6px",
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
            height: "fit-content",
          }}
        >
          -{discount}
        </div>
      </div>

      <button
        onClick={onOpen}
        style={{
          marginTop: "15px",
          width: "100%",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          padding: "12px",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Подробнее
      </button>
    </div>
  );
}