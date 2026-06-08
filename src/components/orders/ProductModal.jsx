export default function ProductModal({
  product,
  onClose,
  onAdd,
}) {
  if (!product) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.6)",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          width: "100%",
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: "hidden",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: 48,
            height: 5,
            background: "#d1d5db",
            borderRadius: 999,
            margin: "12px auto",
          }}
        />

        <div
          style={{
            position: "relative",
          }}
        >
          <img
            src={product.photo_url}
            alt={product.name}
            style={{
              width: "100%",
              height: 280,
              objectFit: "cover",
            }}
          />

          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              background: "rgba(255,255,255,.95)",
              fontSize: 22,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,.15)",
            }}
          >
            ✕
          </button>
        </div>

        <div
          style={{
            padding: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
            }}
          >
            {product.name}
          </h2>

          <div
            style={{
              color: "#0b8f88",
              fontSize: 28,
              fontWeight: 800,
              marginTop: 10,
            }}
          >
            {Number(product.price || 0).toLocaleString()} ₫
          </div>

          <div
            style={{
              marginTop: 16,
              color: "#555",
              lineHeight: 1.6,
            }}
          >
            {product.description || "Описание отсутствует"}
          </div>

          <button
            onClick={() => {
              onAdd(product);
              onClose();
            }}
            style={{
              width: "100%",
              marginTop: 24,
              padding: 16,
              border: "none",
              borderRadius: 16,
              background:
                "linear-gradient(135deg,#22c7b8,#0b8f88)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 16,
            }}
          >
            🛒 Добавить в заказ
          </button>
        </div>
      </div>
    </div>
  );
}
