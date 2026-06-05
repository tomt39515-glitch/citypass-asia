import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function OffersTab() {
  const [partners, setPartners] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadPartners();
  }, []);

  async function loadPartners() {
    try {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .eq("status", "approved")
        .order("business_name");

      if (error) throw error;

      setPartners(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  function openRoute(partner) {
    if (partner.latitude && partner.longitude) {
      window.open(
        `https://www.google.com/maps?q=${partner.latitude},${partner.longitude}`,
        "_blank"
      );
      return;
    }

    if (partner.address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          partner.address
        )}`,
        "_blank"
      );
    }
  }

  const filteredPartners = partners.filter((partner) =>
    (partner.business_name || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg,#14B8A6,#0F766E)",
          borderRadius: "28px",
          padding: "24px",
          color: "#fff",
        }}
      >
        <div>Партнёры CityPass Asia</div>

        <div
          style={{
            fontSize: "34px",
            fontWeight: 800,
            marginTop: "10px",
          }}
        >
          {partners.length}
        </div>

        <div>активных партнёров</div>
      </div>

      <input
        placeholder="Поиск партнёров..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "18px",
          border: "none",
          background: "#fff",
          fontSize: "15px",
          boxSizing: "border-box",
        }}
      />

      {filteredPartners.map((partner) => (
        <div
          key={partner.id}
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "18px",
            boxShadow:
              "0 5px 15px rgba(15,23,42,.05)",
          }}
        >
          {partner.cover_photo_url && (
            <img
              src={partner.cover_photo_url}
              alt={partner.business_name}
              style={{
                width: "100%",
                height: 180,
                objectFit: "cover",
                borderRadius: 16,
                marginBottom: 12,
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                {partner.business_name}
              </div>

              <div>
                {partner.category}
              </div>
            </div>

            <div
              style={{
                background: "#ECFDF5",
                color: "#14B8A6",
                padding: "10px 14px",
                borderRadius: "999px",
                fontWeight: 700,
              }}
            >
              {partner.discount_percent || 0}%
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {partner.address || "Адрес не указан"}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 14,
            }}
          >
            <button
              onClick={() => openRoute(partner)}
              style={{
                flex: 1,
                border: "none",
                borderRadius: "16px",
                padding: "14px",
                background: "#2563eb",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              📍 Маршрут
            </button>

            <button
              style={{
                flex: 1,
                border: "none",
                borderRadius: "16px",
                padding: "14px",
                background:
                  "linear-gradient(135deg,#14B8A6,#0D9488)",
                color: "#fff",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Подробнее
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
