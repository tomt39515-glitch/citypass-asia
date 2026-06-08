import React, { useState } from "react";

export default function ProductModal({
  product,
  onClose,
  onAdd,
}) {
  const [quantity, setQuantity] =
    useState(1);

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
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
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
            overflowY: "auto",
            flex: 1,
          }}
        >
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
                width: 52,
                height: 52,
                borderRadius: "50%",
                border: "none",
                background: "rgba(255,255,255,.95)",
                fontSize: 28,
                cursor: "pointer",
                boxShadow:
                  "0 4px 12px rgba(0,0,0,.15)",
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
              {Number(
                product.price || 0
              ).toLocaleString()} ₫
            </div>

            <div
              style={{
                marginTop: 16,
                color: "#555",
                lineHeight: 1.7,
                fontSize: 18,
              }}
            >
              {product.description ||
                "Описание отсутствует"}
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #eee",
            padding: 16,
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.max(1, q - 1)
                )
              }
            >
              −
            </button>

            <strong>
              {quantity}
            </strong>

            <button
              onClick={() =>
                setQuantity((q) =>
                  q + 1
                )
              }
            >
              +
            </button>
          </div>

          <button
            onClick={() => {
              for (
                let i = 0;
                i < quantity;
                i++
              ) {
                onAdd(product);
              }

              onClose();
            }}
            style={{
              width: "100%",
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
            🛒 Добавить • {(Number(product.price || 0) * quantity).toLocaleString()} ₫
          </button>
        </div>
      </div>
    </div>
  );
}
