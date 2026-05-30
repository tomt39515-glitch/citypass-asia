import PartnerCard from "./PartnerCard";

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
        <PartnerCard
          key={index}
          name={offer.name}
          discount={offer.discount}
          category={offer.category}
          icon={offer.icon}
        />
      ))}
    </div>
  );
}