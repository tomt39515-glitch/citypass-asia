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