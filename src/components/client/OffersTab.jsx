import React from "react";

export default function OffersTab() {
  const offers = [
    {
      name: "Burger House",
      discount: "15%",
      city: "Нячанг",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    },
    {
      name: "Ocean SPA",
      discount: "20%",
      city: "Нячанг",
      image:
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800",
    },
    {
      name: "Coffee Time",
      discount: "10%",
      city: "Хошимин",
      image:
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    },
  ];

  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <h2>🔥 Предложения</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {offers.map((offer) => (
          <div
            key={offer.name}
            style={{
              background: "#fff",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow:
                "0 5px 20px rgba(0,0,0,.05)",
            }}
          >
            <img
              src={offer.image}
              alt=""
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "16px" }}>
              <h3>{offer.name}</h3>

              <p style={{ color: "#666" }}>
                📍 {offer.city}
              </p>

              <div
                style={{
                  color: "#ff7b00",
                  fontWeight: "700",
                  fontSize: "20px",
                }}
              >
                Скидка {offer.discount}
              </div>

              <button
                style={{
                  marginTop: "12px",
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "12px",
                  background: "#ff7b00",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                Подробнее
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}