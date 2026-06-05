import { useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerProductsTab({ partner }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const saveProduct = async () => {
    try {
      setLoading(true);

      let photoUrl = null;

      if (photo) {
        const fileName =
          `${Date.now()}-${photo.name}`;

        const { error: uploadError } =
          await supabase.storage
            .from("partner-images")
            .upload(fileName, photo);

        if (uploadError) throw uploadError;

        photoUrl =
          `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/partner-products/${fileName}`;
      }

      const { error } = await supabase
        .from("partner_products")
        .insert({
          partner_id: partner.id,
          category,
          name,
          description,
          price: Number(price),
          photo_url: photoUrl,
        });

      if (error) throw error;

      alert("Товар добавлен");

      setName("");
      setCategory("");
      setDescription("");
      setPrice("");
      setPhoto(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 15 }}>
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
          padding: 10,
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
          padding: 10,
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
          marginBottom: 10,
          padding: 10,
          minHeight: 100,
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
          padding: 10,
        }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setPhoto(e.target.files[0])
        }
      />

      <button
        onClick={saveProduct}
        disabled={loading}
        style={{
          width: "100%",
          marginTop: 15,
          padding: 12,
          background: "#009688",
          color: "#fff",
          border: "none",
          borderRadius: 8,
        }}
      >
        {loading
          ? "Сохранение..."
          : "Добавить товар"}
      </button>
    </div>
  );
}