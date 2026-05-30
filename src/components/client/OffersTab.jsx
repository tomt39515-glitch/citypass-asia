import { useState } from "react";
import PartnerCard from "./PartnerCard";
import PartnerDetails from "./PartnerDetails";

export default function OffersTab() {
  const [selectedPartner, setSelectedPartner] =
    useState(null);

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

  if (selectedPartner) {
    return (
      <div>
        <button
          onClick={() => setSelectedPartner(null)}
          style={{
            marginBottom: "16px",
            border: "none",
            background: "#2563eb",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          ← Назад
        </button>

        <PartnerDetails />
      </div>
    );
  }

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
          onOpen={() =>
            setSelectedPartner(offer)
          }
        />
      ))}
    </div>
  );
}