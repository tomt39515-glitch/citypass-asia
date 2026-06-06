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

      console.log("TELEGRAM:", telegramId);
      console.log("PARTNER:", partner?.id);

      if (!telegramId || !partner?.id) return;

      const { data: client } = await supabase
        .from("clients")
        .select("id, telegram_id")
        .eq("telegram_id", telegramId)
        .maybeSingle();

      console.log("CLIENT:", client);

      if (!client) return;

      const { data: visit } = await supabase
        .from("client_visits")
        .select("*")
        .eq("client_id", client.id)
        .eq("partner_id", partner.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      console.log("VISIT:", visit);

      if (!visit) return;

      const { data: existingReview } = await supabase
        .from("partner_reviews")
        .select("id")
        .eq("visit_id", visit.id)
        .maybeSingle();

      console.log("REVIEW:", existingReview);

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
}