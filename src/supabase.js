import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import PartnerCard from "./PartnerCard";

export default function OffersTab() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPartners();
  }, []);

  async function loadPartners() {
    const { data, error } = await supabase
      .from("partners")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.error(error);
      return;
    }

    setOffers(data || []);
    setLoading(false);
  }

  if (loading) {
    return <div>Загрузка партнёров...</div>;
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

      {offers.map((offer) => (
        <PartnerCard
          key={offer.id}
          name={offer.business_name}
          category={offer.category}
          discount={offer.discount || 0}
          icon="🏪"
        />
      ))}
    </div>
  );
}