import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function ClientPartnerPage({
  partner,
  onBack,
}) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, [partner]);

  async function loadProducts() {
    if (!partner?.id) return;

    const { data } = await supabase
      .from("partner_products")
      .select("*")
      .eq("partner_id", partner.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    setProducts(data || []);
  }

  function openRoute() {
    if (partner?.latitude && partner?.longitude) {
      window.open(
        `https://www.google.com/maps?q=${partner.latitude},${partner.longitude}`,
        "_blank"
      );
      return;
    }

    if (partner?.address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(partner.address)}`,
        "_blank"
      );
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <button onClick={onBack}>
        ← Назад
      </button>

      <h2>{partner?.business_name}</h2>

      {partner?.cover_photo_url && (
        <img
          src={partner.cover_photo_url}
          alt={partner.business_name}
          style={{
            width: "100%",
            borderRadius: 16,
            marginTop: 12,
            marginBottom: 12,
          }}
        />
      )}

      <div>{partner?.description}</div>

      <div style={{ marginTop: 10 }}>
        📞 {partner?.phone || "Не указан"}
      </div>

      <div style={{ marginTop: 10 }}>
        📍 {partner?.address || "Не указан"}
      </div>

      <button
        onClick={openRoute}
        style={{
          marginTop: 12,
          padding: 12,
        }}
      >
        📍 Маршрут
      </button>


      <h3 style={{ marginTop: 20 }}>
        Товары и услуги
      </h3>

      {products.length === 0 && (
        <div>Активных товаров нет</div>
      )}

      {products.map((item) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          {item.photo_url && (
            <img
              src={item.photo_url}
              alt={item.name}
              style={{
                width: "100%",
                borderRadius: 10,
                marginBottom: 10,
              }}
            />
          )}

          <strong>{item.name}</strong>

          <div>{item.price} VND</div>

          <div>{item.description}</div>
        </div>
      ))}
    </div>
  );
}
