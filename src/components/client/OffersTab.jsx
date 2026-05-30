export default function OffersTab() {
  const offers = [
    {
      name: "Burger House",
      discount: "15%",
      category: "Ресторан",
      icon: "🍔",
    },
    {
      name: "Ocean SPA",
      discount: "20%",
      category: "SPA",
      icon: "💆",
    },
    {
      name: "Seaside Hotel",
      discount: "10%",
      category: "Отель",
      icon: "🏨",
    },
    {
      name: "Coffee Time",
      discount: "10%",
      category: "Кафе",
      icon: "☕",
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h2>🎁 Скидки партнёров</h2>

      <input
        placeholder="Поиск партнёра..."
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "14px",
          border: "1px solid #ddd",
          boxSizing: "border-box",
        }}
      />

      {offers.map((offer, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "18px",
            boxShadow: "0 4px 15px rgba(0,0,0,.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0 }}>
                {offer.icon} {offer.name}
              </h3>

              <div
                style={{
                  color: "#666",
                  marginTop: "5px",
                }}
              >
                {offer.category}
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
              -{offer.discount}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}