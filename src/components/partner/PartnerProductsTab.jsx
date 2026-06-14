import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerProductsTab() {
  const [partner, setPartner] = useState(null);
  const [products, setProducts] = useState([]);

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);


  const [saving, setSaving] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  const [expandedOfferId, setExpandedOfferId] = useState(null);
  const [offerType, setOfferType] = useState("");
  const [offerText, setOfferText] = useState("");
  const [offerStartsAt, setOfferStartsAt] = useState("");
  const [offerExpiresAt, setOfferExpiresAt] = useState("");


  useEffect(() => {
    loadPartner();
  }, []);

  useEffect(() => {
    if (partner?.id) {
      loadProducts(partner.id);
    }
  }, [partner]);

  async function loadPartner() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId) return;

      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("telegram_id", Number(telegramId))
        .order("id", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data?.length) {
        setPartner(data[0]);
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  async function loadProducts(partnerId) {
    try {
      setLoadingProducts(true);

      const { data, error } = await supabase
        .from("partner_products")
        .select("*")
        .eq("partner_id", partnerId)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  }

  async function deleteProduct(productId) {
    const ok = window.confirm(
      "Удалить товар?"
    );

    if (!ok) return;

    try {
      const { error } = await supabase
        .from("partner_products")
        .delete()
        .eq("id", productId);

      if (error) throw error;

      setProducts((prev) =>
        prev.filter((x) => x.id !== productId)
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }


  async function toggleProduct(productId, currentState) {
    try {
      const { error } = await supabase
        .from("partner_products")
        .update({
          is_active: !currentState,
        })
        .eq("id", productId);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((item) =>
          item.id === productId
            ? {
                ...item,
                is_active: !currentState,
              }
            : item
        )
      );
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }


  async function saveOffer(productId) {
    try {
      const { error } = await supabase
        .from("partner_products")
        .update({
          is_special_offer: true,
          offer_type: offerType,
          offer_text: offerText,
          offer_starts_at: offerStartsAt || null,
          offer_expires_at: offerExpiresAt || null,
        })
        .eq("id", productId);

      if (error) throw error;

      alert("Акция сохранена");

      await loadProducts(partner.id);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }



  async function disableOffer(productId) {
    try {
      const { error } = await supabase
        .from("partner_products")
        .update({
          is_special_offer: false,
          offer_type: null,
          offer_text: null,
          offer_starts_at: null,
          offer_expires_at: null,
        })
        .eq("id", productId);

      if (error) throw error;

      alert("Акция отключена");

      await loadProducts(partner.id);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }


  async function saveProduct() {
    try {
      if (!partner) {
        alert("Партнер не найден");
        return;
      }

      setSaving(true);

      let photoUrl = null;

      if (photo) {
        const extension =
          photo.name.split(".").pop();

        const fileName =
          `product-${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from("partner-images")
            .upload(fileName, photo, {
              upsert: true,
            });

        if (uploadError) throw uploadError;

        const { data } =
          supabase.storage
            .from("partner-images")
            .getPublicUrl(fileName);

        photoUrl = data.publicUrl;
      }

      const { error } = await supabase
        .from("partner_products")
        .insert({
          partner_id: partner.id,
          category,
          name,
          description,
          price: Number(price || 0),
          photo_url: photoUrl,
          is_active: true,
        });

      if (error) throw error;

      alert("Товар успешно добавлен");

      setCategory("");
      setName("");
      setDescription("");
      setPrice("");
      setPhoto(null);

      await loadProducts(partner.id);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h2>📦 Товары и услуги</h2>

        <input
          placeholder="Категория"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          style={{
            width: "100%",
            marginBottom: 10,
          }}
        />

        <input
          placeholder="Название"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          style={{
            width: "100%",
            marginBottom: 10,
          }}
        />

        <textarea
          placeholder="Описание"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          style={{
            width: "100%",
            minHeight: 120,
            marginBottom: 10,
          }}
        />

        <input
          type="number"
          placeholder="Цена"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          style={{
            width: "100%",
            marginBottom: 10,
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setPhoto(
              e.target.files?.[0] || null
            )
          }
        />

        <button
          onClick={saveProduct}
          disabled={saving}
          style={{
            width: "100%",
            marginTop: 15,
            padding: 14,
          }}
        >
          {saving
            ? "Сохранение..."
            : "Добавить товар"}
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: 20,
        }}
      >
        <h2>Мои товары</h2>

        {loadingProducts && (
          <div>Загрузка...</div>
        )}

        {!loadingProducts &&
          products.length === 0 && (
            <div>
              Пока нет товаров
            </div>
          )}

        {products.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #eee",
              borderRadius: 16,
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
                  maxHeight: 220,
                  objectFit: "cover",
                  borderRadius: 12,
                  marginBottom: 10,
                }}
              />
            )}

            <h3>{item.name}</h3>

            <div>
              Категория: {item.category}
            </div>

            <div>
              Цена: {item.price}
            </div>

            <div
              style={{
                marginTop: 8,
              }}
            >
              {item.description}
            </div>


            <div
              style={{
                marginTop: 10,
                fontWeight: "bold",
              }}
            >
              {item.is_active
                ? "🟢 Активен"
                : "🔴 Скрыт"}
            </div>


            <button
              onClick={() =>
                setExpandedOfferId(
                  expandedOfferId === item.id ? null : item.id
                )
              }
              style={{
                marginTop: 10,
                marginRight: 10,
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: "#F59E0B",
                color: "#fff",
              }}
            >
              🔥 Акция
            </button>

            {expandedOfferId === item.id && (
              <div
                style={{
                  marginTop: 12,
                  padding: 12,
                  background: "#FFF7ED",
                  borderRadius: 12,
                }}
              >
                <div style={{fontWeight:'bold',marginBottom:10}}>🔥 Настройка акции</div>

                <select style={{width:'100%',marginBottom:10}} value={offerType} onChange={(e)=>setOfferType(e.target.value)}>
                  <option value=''>Выберите тип акции</option>
                  <option>🔥 Скидка</option>
                  <option>🎁 Подарок</option>
                  <option>💰 Спеццена</option>
                  <option>📦 Пакет / Комбо</option>
                  <option>⭐ Бонус</option>
                  <option>🎉 Спецусловие</option>
                </select>

                <textarea
                  placeholder='Описание акции'
                  value={offerText}
                  onChange={(e)=>setOfferText(e.target.value)}
                  style={{width:'100%',minHeight:80,marginBottom:10}}
                />

                <div>Дата начала</div>
                <input
                  type='date'
                  value={offerStartsAt}
                  onChange={(e)=>setOfferStartsAt(e.target.value)}
                  style={{width:'100%',marginBottom:10}}
                />

                <div>Дата окончания</div>
                <input
                  type='date'
                  value={offerExpiresAt}
                  onChange={(e)=>setOfferExpiresAt(e.target.value)}
                  style={{width:'100%',marginBottom:10}}
                />

                {item.is_special_offer ? (
                  <>
                    <div
                      style={{
                        marginTop: 10,
                        padding: 12,
                        background: "#DCFCE7",
                        borderRadius: 8,
                        fontWeight: 600,
                        color: "#166534",
                      }}
                    >
                      🟢 Акция опубликована
                    </div>

                    <button
                      onClick={() => disableOffer(item.id)}
                      style={{
                        marginTop: 10,
                        padding: "10px 14px",
                        background: "#EF4444",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                      }}
                    >
                      ❌ Отключить акцию
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => saveOffer(item.id)}
                    style={{
                      padding: "10px 14px",
                      background: "#10B981",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                    }}
                  >
                    Сохранить акцию
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() =>
                toggleProduct(
                  item.id,
                  item.is_active
                )
              }
              style={{
                marginTop: 10,
                marginRight: 10,
                padding: "10px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              {item.is_active
                ? "Скрыть"
                : "Активировать"}
            </button>

            <button
              onClick={() =>
                deleteProduct(item.id)
              }
              style={{
                marginTop: 12,
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                padding: "10px 14px",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}