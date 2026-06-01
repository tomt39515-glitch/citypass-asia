import { useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerRegistration({
  onClose,
}) {
  const telegramId =
    window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const [businessName, setBusinessName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [discountPercent,
    setDiscountPercent] =
    useState(5);

  const [description,
    setDescription] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [photoUrl, setPhotoUrl] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  async function submitApplication() {
    const { error } =
      await supabase
        .from("partner_applications")
        .insert({
          telegram_id: String(telegramId),
          business_name: businessName,
          category,
          discount_percent:
            Number(discountPercent),
          description,
          address,
          photo_url: photoUrl,
          status: "pending",
        });

    if (error) {
      alert(error.message);
      return;
    }

    setSuccess(true);
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,.5)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#fff",
          borderRadius: "24px",
          padding: "24px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {success ? (
          <>
            <h2>
              ✅ Заявка отправлена
            </h2>

            <p>
              Статус:
              На модерации
            </p>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "14px",
                background: "#14B8A6",
                color: "#fff",
                fontWeight: "700",
              }}
            >
              Закрыть
            </button>
          </>
        ) : (
          <>
            <h2>
              Стать партнёром CityPass
            </h2>

            <input
              placeholder="Название бизнеса"
              value={businessName}
              onChange={(e) =>
                setBusinessName(
                  e.target.value
                )
              }
            />

            <br /><br />

            <input
              placeholder="Категория"
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            />

            <br /><br />

            <input
              type="number"
              min="5"
              placeholder="Скидка %"
              value={discountPercent}
              onChange={(e) =>
                setDiscountPercent(
                  e.target.value
                )
              }
            />

            <br /><br />

            <textarea
              placeholder="Описание"
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
            />

            <br /><br />

            <input
              placeholder="Адрес"
              value={address}
              onChange={(e) =>
                setAddress(
                  e.target.value
                )
              }
            />

            <br /><br />

            <input
              placeholder="Ссылка на фото"
              value={photoUrl}
              onChange={(e) =>
                setPhotoUrl(
                  e.target.value
                )
              }
            />

            <br /><br />

            <button
              onClick={
                submitApplication
              }
              style={{
                width: "100%",
                padding: "14px",
                border: "none",
                borderRadius: "14px",
                background: "#14B8A6",
                color: "#fff",
                fontWeight: "700",
              }}
            >
              Отправить заявку
            </button>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                marginTop: "10px",
                padding: "14px",
                border: "none",
                borderRadius: "14px",
                background: "#E2E8F0",
              }}
            >
              Отмена
            </button>
          </>
        )}
      </div>
    </div>
  );
}