import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerProductsTab() {
  const [partner, setPartner] = useState(null);

  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPartner();
  }, []);

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

      if (data && data.length > 0) {
        setPartner(data[0]);
      }
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
    </div>
  );
}
