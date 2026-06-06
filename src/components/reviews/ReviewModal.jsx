import { useState } from "react";
import { supabase } from "../../supabase";

export default function ReviewModal({
  visit,
  onClose,
}) {
  const [rating, setRating] =
    useState(5);

  const [reviewText, setReviewText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function submitReview() {
    try {
      setLoading(true);

      const { error } =
        await supabase
          .from("partner_reviews")
          .insert({
            partner_id:
              visit.partner_id,
            client_id:
              visit.client_id,
            visit_id:
              visit.id,
            rating,
            review_text:
              reviewText,
          });

      if (error) throw error;

      alert(
        "Спасибо за отзыв!"
      );

      onClose();
    } catch (err) {
      console.error(err);
      alert(
        "Ошибка при сохранении отзыва"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          width: "90%",
          maxWidth: 400,
        }}
      >
        <h2>
          Спасибо за посещение!
        </h2>

        <p>
          Оцените партнёра
        </p>

        <div
          style={{
            fontSize: 32,
            marginBottom: 20,
          }}
        >
          {[1, 2, 3, 4, 5].map(
            (star) => (
              <span
                key={star}
                onClick={() =>
                  setRating(star)
                }
                style={{
                  cursor: "pointer",
                }}
              >
                {star <= rating
                  ? "⭐"
                  : "☆"}
              </span>
            )
          )}
        </div>

        <textarea
          value={reviewText}
          onChange={(e) =>
            setReviewText(
              e.target.value
            )
          }
          placeholder="Комментарий (необязательно)"
          rows={4}
          style={{
            width: "100%",
            marginBottom: 16,
          }}
        />

        <div
          style={{
            display: "flex",
            gap: 10,
          }}
        >
          <button
            onClick={submitReview}
            disabled={loading}
          >
            Отправить
          </button>

          <button
            onClick={onClose}
          >
            Позже
          </button>
        </div>
      </div>
    </div>
  );
}