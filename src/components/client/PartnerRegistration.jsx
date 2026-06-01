```jsx
import { useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerRegistration({
  onClose,
}) {
  const telegramId =
    window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const [businessName, setBusinessName] =
    useState("");

  const [contactName, setContactName] =
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

  const [logoUrl, setLogoUrl] =
    useState("");

  const [success, setSuccess] =
    useState(false);

  async function submitApplication() {
    if (
      !businessName ||
      !contactName ||
      !category
    ) {
      alert(
        "Заполните обязательные поля"
      );
      return;
    }

    const { error } =
      await supabase
        .from("partner_applications")
        .insert({
          telegram_id:
            String(telegramId),
          business_name:
            businessName,
          contact_name:
            contactName,
          category,
          discount_percent:
            Number(
              discountPercent
            ),
          description,
          address,
          logo_url: logoUrl,
          status: "pending",
        });

    if (error) {
      alert(error.message);
      return;
    }

    setSuccess(true);
  }

  const inputStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    border: "1px solid #E2E8F0",
    background: "#F8FAFC",
    fontSize: "16px",
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(15,23,42,.65)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent:
          "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#fff",
          borderRadius: "28px",
          overflow: "hidden",
          boxShadow:
            "0 20px 60px rgba(0,0,0,.2)",
        }}
      >
        {success ? (
          <div
            style={{
              padding: "30px",
              textAlign:
                "center",
            }}
          >
            <div
              style={{
                fontSize: "56px",
              }}
            >
              ✅
            </div>

            <h2>
              Заявка отправлена
            </h2>

            <p>
              Статус:
              На модерации
            </p>

            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: "16px",
                border: "none",
                borderRadius:
                  "18px",
              }}
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                background:
                  "linear-gradient(135deg,#14B8A6,#0F766E)",
                padding:
                  "24px",
                color: "#fff",
              }}
            >
              <h2>
                Стать партнёром
              </h2>
            </div>

            <div
              style={{
                padding:
                  "24px",
              }}
            >
              <input
                placeholder="Название бизнеса"
                value={
                  businessName
                }
                onChange={(e) =>
                  setBusinessName(
                    e.target
                      .value
                  )
                }
                style={
                  inputStyle
                }
              />

              <div
                style={{
                  height:
                    "14px",
                }}
              />

              <input
                placeholder="Контактное лицо"
                value={
                  contactName
                }
                onChange={(e) =>
                  setContactName(
                    e.target
                      .value
                  )
                }
                style={
                  inputStyle
                }
              />

              <div
                style={{
                  height:
                    "14px",
                }}
              />

              <select
                value={
                  category
                }
                onChange={(e) =>
                  setCategory(
                    e.target
                      .value
                  )
                }
                style={
                  inputStyle
                }
              >
                <option value="">
                  Выберите категорию
                </option>

                <option>
                  🍽 Ресторан
                </option>

                <option>
                  ☕ Кафе
                </option>

                <option>
                  🏨 Отель
                </option>

                <option>
                  🛍 Магазин
                </option>

                <option>
                  💆 SPA
                </option>

                <option>
                  🏋 Фитнес
                </option>

                <option>
                  🚕 Транспорт
                </option>

                <option>
                  🎡 Развлечения
                </option>

                <option>
                  🏥 Услуги
                </option>
              </select>

              <div
                style={{
                  height:
                    "14px",
                }}
              />

              <input
                type="number"
                min="5"
                max="90"
                placeholder="Размер скидки %"
                value={
                  discountPercent
                }
                onChange={(e) =>
                  setDiscountPercent(
                    e.target
                      .value
                  )
                }
                style={
                  inputStyle
                }
              />

              <div
                style={{
                  height:
                    "14px",
                }}
              />

              <textarea
                rows="4"
                placeholder="Описание бизнеса"
                value={
                  description
                }
                onChange={(e) =>
                  setDescription(
                    e.target
                      .value
                  )
                }
                style={{
                  ...inputStyle,
                  resize:
                    "none",
                }}
              />

              <div
                style={{
                  height:
                    "14px",
                }}
              />

              <input
                placeholder="Адрес бизнеса"
                value={
                  address
                }
                onChange={(e) =>
                  setAddress(
                    e.target
                      .value
                  )
                }
                style={
                  inputStyle
                }
              />

              <div
                style={{
                  height:
                    "14px",
                }}
              />

              <input
                placeholder="Ссылка на логотип или фото"
                value={
                  logoUrl
                }
                onChange={(e) =>
                  setLogoUrl(
                    e.target
                      .value
                  )
                }
                style={
                  inputStyle
                }
              />

              <button
                onClick={
                  submitApplication
                }
                style={{
                  width:
                    "100%",
                  marginTop:
                    "20px",
                  padding:
                    "16px",
                  border:
                    "none",
                  borderRadius:
                    "18px",
                }}
              >
                Отправить заявку
              </button>

              <button
                onClick={
                  onClose
                }
                style={{
                  width:
                    "100%",
                  marginTop:
                    "10px",
                  padding:
                    "16px",
                  border:
                    "none",
                  borderRadius:
                    "18px",
                }}
              >
                Отмена
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```
