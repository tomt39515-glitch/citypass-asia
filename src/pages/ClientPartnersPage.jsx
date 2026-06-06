
import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function ClientPartnerPage({
  partner,
  onBack,
}) {
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [visitId, setVisitId] = useState(null);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    loadProducts();
    loadReviews();
    checkReviewAccess();
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

  async function loadReviews() {
    if (!partner?.id) return;

    const { data } = await supabase
      .from("partner_reviews")
      .select("*")
      .eq("partner_id", partner.id)
      .order("created_at", { ascending: false });

    setReviews(data || []);
  }

  
  async function checkReviewAccess() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId || !partner?.id) return;

      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("telegram_id", telegramId)
        .maybeSingle();

      if (!client) return;

      const { data: visit } = await supabase
        .from("client_visits")
        .select("*")
        .eq("client_id", client.id)
        .eq("partner_id", partner.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!visit) return;

      const { data: existingReview } = await supabase
        .from("partner_reviews")
        .select("id")
        .eq("visit_id", visit.id)
        .maybeSingle();

      if (existingReview) return;

      setVisitId(visit.id);
      setCanReview(true);
    } catch (err) {
      console.error(err);
    }
  }

  async function submitReview() {
    try {
      if (!visitId) return;

      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      const { data: client } = await supabase
        .from("clients")
        .select("id")
        .eq("telegram_id", telegramId)
        .single();

      const { error } = await supabase
        .from("partner_reviews")
        .insert({
          partner_id: partner.id,
          client_id: client.id,
          visit_id: visitId,
          rating,
          review_text: reviewText,
        });

      if (error) throw error;

      alert("Отзыв сохранён");

      setCanReview(false);
      setReviewText("");
      loadReviews();
    } catch (err) {
      console.error(err);
      alert("Ошибка сохранения отзыва");
    }
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
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          partner.address
        )}`,
        "_blank"
      );
    }
  }

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div style={{ padding: 16 }}>
      <button onClick={onBack}>
        ← Назад
      </button>

      <h2>{partner?.business_name}</h2>

      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#f59e0b",
          }}
        >
          ⭐ {avgRating} ({reviews.length} отзывов)
        </div>

        <div style={{ marginTop: 6 }}>
          ☕ {partner?.category || "Категория не указана"}
        </div>

        <div
          style={{
            marginTop: 6,
            color: "#16a34a",
            fontWeight: 600,
          }}
        >
          🎁 Скидка {partner?.discount_percent || partner?.discount || 0}%
        </div>
      </div>

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

      
      {canReview && (
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 12,
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <h3>Оставить отзыв</h3>

          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
            }}
          >
            <option value={5}>⭐⭐⭐⭐⭐</option>
            <option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option>
            <option value={2}>⭐⭐</option>
            <option value={1}>⭐</option>
          </select>

          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Ваш отзыв"
            style={{
              width: "100%",
              minHeight: 100,
              padding: 10,
            }}
          />

          <button
            onClick={submitReview}
            style={{
              marginTop: 10,
              padding: 12,
              width: "100%",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: 10,
            }}
          >
            Отправить отзыв
          </button>
        </div>
      )}

      <h3 style={{ marginTop: 24 }}>
        Отзывы клиентов
      </h3>

      {reviews.length === 0 && (
        <div style={{ color: "#666" }}>
          Пока нет отзывов
        </div>
      )}

      {reviews.map((review) => (
        <div
          key={review.id}
          style={{
            border: "1px solid #eee",
            borderRadius: 12,
            padding: 12,
            marginTop: 10,
          }}
        >
          <div
            style={{
              color: "#f59e0b",
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            ⭐ {review.rating}
          </div>

          <div>
            {review.review_text || "Без текста"}
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#888",
              marginTop: 8,
            }}
          >
            {new Date(review.created_at).toLocaleDateString("ru-RU")}
          </div>
        </div>
      ))}

      <h3 style={{ marginTop: 24 }}>
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

