import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerProductsTab() {
  const [partner, setPartner] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    loadPartner();
  }, []);

  async function loadPartner() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId) {
        alert("Telegram ID не найден");
        return;
      }

      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("telegram_id", Number(telegramId))
        .order("id", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        alert("Партнёр не найден");
        return;
      }

      const currentPartner = data[0];

      setPartner(currentPartner);

      await loadProducts(currentPartner.id);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadProducts(partnerId) {
    const { data, error } = await supabase
      .from("partner_products")
      .select("*")
      .eq("partner_id", partnerId)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  }

  async function addProduct() {
    if (!name.trim()) {
      alert("Введите название");
      return;
    }

    if (!partner) {
      alert("Партнёр не найден");
      return;
    }

    try {
      const { error } = await supabase
        .from("partner_products")
        .insert({
          partner_id: partner.id,
          name,
          category,
          description,
          price: Number(price || 0),
          is_active: true,
        });

      if (error) throw error;

      setName("");
      setCategory("");
      setDescription("");
      setPrice("");

      await loadProducts(partner.id);

      alert("Товар добавлен");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "16px" }}>
        Загрузка...
      </div>
    );
  }

  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "24px",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          🛍️ Товары и услуги
        </h2>

        <input
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          placeholder="Название"
          style={inputStyle}
        />

        <input
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          placeholder="Категория"
          style={inputStyle}
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Описание"
          style={{
            ...inputStyle,
            minHeight: "90px",
          }}
        />

        <input
          type="number"
          value={price}
          onChange={(e) =>
            setPrice(e.target.value)
          }
          placeholder="Цена"
          style={inputStyle}
        />

        <button
          onClick={addProduct}
          style={{
            width: "100%",
            padding: "14px",
            border: "none",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg,#14B8A6,#0D9488)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: "24px",
          }}
        >
          + Добавить товар
        </button>

        <h3>Мои товары</h3>

        {products.length === 0 ? (
          <div
            style={{
              color: "#64748B",
            }}
          >
            Товаров пока нет
          </div>
        ) : (
          products.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#F8FAFC",
                borderRadius: "16px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              >
                {item.name}
              </div>

              {item.category && (
                <div
                  style={{
                    color: "#14B8A6",
                    marginTop: "4px",
                  }}
                >
                  {item.category}
                </div>
              )}

              {item.description && (
                <div
                  style={{
                    marginTop: "8px",
                  }}
                >
                  {item.description}
                </div>
              )}

              <div
                style={{
                  marginTop: "10px",
                  fontWeight: 700,
                }}
              >
                {Number(
                  item.price || 0
                ).toLocaleString()} ₫
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #CBD5E1",
  borderRadius: "12px",
  marginBottom: "12px",
  boxSizing: "border-box",
};