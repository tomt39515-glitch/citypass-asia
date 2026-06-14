import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function SpecialOffersTab({ onOpenPartner }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();

  const activeOffers = offers.filter(o =>
    !o.offer_starts_at || new Date(o.offer_starts_at) <= now
  );

  const upcomingOffers = offers.filter(o =>
    o.offer_starts_at && new Date(o.offer_starts_at) > now
  );

  function daysLeft(date) {
    if (!date) return "";
    const diff = Math.ceil((new Date(date) - new Date()) / (1000*60*60*24));
    return diff > 0 ? `⏳ Осталось ${diff} дней` : "Завершается сегодня";
  }

  useEffect(() => {
    loadOffers();
  }, []);

  async function loadOffers() {
    try {
      const { data, error } = await supabase
        .from("partner_products")
        .select("*")
        .eq("is_special_offer", true)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const { data: partners } = await supabase
        .from("partners")
        .select("*");

      const offersWithPartners = (data || []).map(item => ({
        ...item,
        partner: (partners || []).find(
          p => Number(p.id) === Number(item.partner_id)
        )
      }));

      setOffers(offersWithPartners);
      return;

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 16, minHeight: "100vh", background: "#F6F8FB" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#F59E0B,#EA580C)",
          borderRadius: 28,
          padding: 24,
          color: "#fff",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 18, opacity: 0.9 }}>CityPass Asia</div>
        <div style={{ marginTop: 10, fontSize: 34, fontWeight: 800 }}>
          🔥 Специальные предложения
        </div>
      </div>

      {loading && <div>Загрузка...</div>}

      {!loading && offers.length === 0 && (
        <div style={{ background:"#fff", borderRadius:24, padding:24 }}>
          Пока нет активных акций
        </div>
      )}

      <h2>🔥 Активные акции</h2>
      {activeOffers.map((item) => (
        <div
          key={item.id}
          style={{
            background: "#fff",
            borderRadius: 24,
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          {item.photo_url && (
            <img
              src={item.photo_url}
              alt={item.name}
              style={{ width: "100%", height: 220, objectFit: "cover" }}
            />
          )}

          <div style={{ padding: 16 }}>
            <div style={{fontSize:14,color:"#64748B"}}>
              🏪 Партнер CityPass
            </div>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{item.name}</div>

            <div
              style={{
                marginTop: 8,
                color: "#64748B",
              }}
            >
              📂 {item.category}
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 22,
                fontWeight: 700,
                color: "#10B981",
              }}
            >
              💰 {Number(item.price || 0).toLocaleString()} ₫
            </div>

            <div
              style={{
                display: "inline-block",
                marginTop: 10,
                background: "#FEF3C7",
                padding: "6px 10px",
                borderRadius: 8,
              }}
            >
              {item.offer_type}
            </div>

            <div style={{ marginTop: 12 }}>{item.offer_text}</div>

            <div style={{ marginTop: 12, color: "#64748B" }}>
              {daysLeft(item.offer_expires_at)}
            </div>

            <button
              onClick={() => item.partner && onOpenPartner?.(item.partner)}
              style={{
                marginTop:12,
                padding:"10px 14px",
                borderRadius:10,
                border:"none",
                background:"#10B981",
                color:"#fff",
                cursor:"pointer"
              }}
            >
              Перейти к заведению
            </button>
          </div>
        </div>
      ))}

      {upcomingOffers.length > 0 && (
        <>
          <h2 style={{marginTop:24}}>⏳ Скоро стартуют</h2>
          {upcomingOffers.map((item) => (
            <div key={item.id} style={{background:"#fff",borderRadius:24,padding:16,marginBottom:16}}>
              <div style={{fontSize:22,fontWeight:700}}>{item.name}</div>
              <div style={{color:"#64748B",marginTop:8}}>
                Старт: {item.offer_starts_at?.slice(0,10)}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
