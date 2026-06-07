import React, {
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabase";

import CartPanel from "../components/orders/CartPanel";
import LocationGuard from "../components/orders/LocationGuard";

export default function ClientPartnerPageV2({
  partner,
  onBack,
}) {
  const [products, setProducts] =
    useState([]);

  const [cart, setCart] =
    useState([]);

  const [canOrder, setCanOrder] =
    useState(false);

  const [loading, setLoading] =
    useState(false);
const [serviceType, setServiceType] =
  useState("table");

const [tableNumber, setTableNumber] =
  useState("");
const [reviews, setReviews] =
  useState([]);

const [showReviews, setShowReviews] =
  useState(false);

const [canReview, setCanReview] =
  useState(false);

const [visitId, setVisitId] =
  useState(null);

const [rating, setRating] =
  useState(5);

const [reviewText, setReviewText] =
  useState("");
  useEffect(() => {
  loadProducts();
  loadReviews();
  checkReviewAccess();
}, [partner]);

  async function loadProducts() {
    if (!partner?.id) return;

    const { data, error } =
      await supabase
        .from("partner_products")
        .select("*")
        .eq(
          "partner_id",
          partner.id
        )
        .eq(
          "is_active",
          true
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

    if (error) {
      console.error(error);
      return;
    }

    setProducts(data || []);
  }
async function loadReviews() {
  if (!partner?.id) return;

  const { data: reviewsData } = await supabase
    .from("partner_reviews")
    .select("*")
    .eq("partner_id", partner.id)
    .order("created_at", { ascending: false });

  if (!reviewsData?.length) {
    setReviews([]);
    return;
  }

  const clientIds = reviewsData.map(
    (r) => r.client_id
  );

  const { data: clientsData } =
    await supabase
      .from("clients")
      .select("id, full_name")
      .in("id", clientIds);

  const reviewsWithNames =
    reviewsData.map((review) => ({
      ...review,
      client_name:
        clientsData?.find(
          (c) =>
            Number(c.id) ===
            Number(review.client_id)
        )?.full_name || "Гость",
    }));

  setReviews(reviewsWithNames);
}

async function checkReviewAccess() {
  try {
    const telegramId =
      window.Telegram?.WebApp
        ?.initDataUnsafe?.user?.id;

    if (!telegramId || !partner?.id)
      return;

    const { data: client } =
      await supabase
        .from("clients")
        .select("id")
        .eq(
  "telegram_id",
  String(telegramId)
)
        .maybeSingle();

    if (!client) return;

    const { data: visit } =
      await supabase
        .from("client_visits")
        .select("*")
        .eq(
          "client_id",
          client.id
        )
        .eq(
          "partner_id",
          partner.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        )
        .limit(1)
        .maybeSingle();

    if (!visit) return;

    const {
      data: existingReview,
    } = await supabase
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
      window.Telegram?.WebApp
        ?.initDataUnsafe?.user?.id;

    const { data: client } =
      await supabase
        .from("clients")
        .select("id")
        .eq(
          "telegram_id",
          telegramId
        )
        .single();

    const { error } =
      await supabase
        .from("partner_reviews")
        .insert({
          partner_id:
            partner.id,
          client_id:
            client.id,
          visit_id:
            visitId,
          rating,
          review_text:
            reviewText,
        });

    if (error) throw error;

    alert("Отзыв сохранён");

    setCanReview(false);
    setReviewText("");

    loadReviews();
  } catch (err) {
    console.error(err);
    alert(
      "Ошибка сохранения отзыва"
    );
  }
}

function openRoute() {
  if (
    partner?.latitude &&
    partner?.longitude
  ) {
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
  function addToCart(product) {
    setCart((prev) => {
      const existing =
        prev.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        return prev.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: Number(
            product.price || 0
          ),
          quantity: 1,
        },
      ];
    });
  }

  function increaseQuantity(id) {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      )
    );
  }

  function decreaseQuantity(id) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }
const avgRating =
  reviews.length > 0
    ? (
        reviews.reduce(
          (sum, r) =>
            sum +
            Number(r.rating || 0),
          0
        ) / reviews.length
      ).toFixed(1)
    : 0;
  async function submitOrder() {
    try {
    if (!cart.length) {
  alert("Корзина пуста");
  return;
}

if (
  serviceType === "table" &&
  !tableNumber.trim()
) {
  alert("Введите номер столика");
  return;
}

      setLoading(true);

      const telegramId =
        window.Telegram?.WebApp
          ?.initDataUnsafe?.user
          ?.id;

      if (!telegramId) {
        alert(
          "Не удалось определить клиента"
        );
        return;
      }

      const { data: client } =
        await supabase
          .from("clients")
          .select("id")
          .eq(
            "telegram_id",
            String(
              telegramId
            )
          )
          .single();

      if (!client) {
        alert(
          "Клиент не найден"
        );
        return;
      }

      const subtotal =
        cart.reduce(
          (sum, item) =>
            sum +
            item.price *
              item.quantity,
          0
        );

      const discountPercent =
        Number(
          partner?.discount_percent ||
            0
        );

      const discountAmount =
        subtotal *
        (discountPercent / 100);

      const totalAmount =
        subtotal -
        discountAmount;

      const orderNumber =
        `CPA-${Date.now()}`;

      const {
        data: order,
        error: orderError,
      } = await supabase
        .from("orders")
        .insert({
          order_number:
            orderNumber,

          client_id:
            client.id,

          partner_id:
            partner.id,
service_type:
  serviceType,

table_number:
  serviceType === "table"
    ? tableNumber
    : null,
          order_type:
            "food",

          status:
            "pending",

          subtotal,

          discount_amount:
            discountAmount,

          total_amount:
            totalAmount,
        })
        .select()
        .single();

      if (orderError)
        throw orderError;

      try {
        await fetch(
          "https://doswzyuumcwxjmltcgeh.supabase.co/functions/v1/send-telegram-notification",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              order_id: order.id,
              partner_id: partner.id,
              order_number: orderNumber,
              total_amount: totalAmount,
              service_type: serviceType,
              table_number: tableNumber,
            }),
          }
        );
      } catch (e) {
        console.error(
          "Telegram notification error",
          e
        );
      }

      const items =
        cart.map((item) => ({
          order_id:
            order.id,

          item_id:
            item.id,

          item_name_snapshot:
            item.name,

          unit_price:
            item.price,

          quantity:
            item.quantity,

          total_price:
            item.price *
            item.quantity,
        }));

      const {
        error:
          itemsError,
      } = await supabase
        .from("order_items")
        .insert(items);

      if (itemsError)
        throw itemsError;

      alert(
        "Заказ отправлен"
      );

      setCart([]);
    } catch (err) {
  console.error(err);

  alert(
    err?.message ||
    JSON.stringify(err)
  );
}
finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: 16,
      }}
    >
      <button
        onClick={onBack}
      >
        ← Назад
      </button>

      <h2>
        {partner?.business_name}
      </h2>
<div
  style={{
    fontSize: 18,
    fontWeight: 600,
    color: "#f59e0b",
    marginBottom: 10,
  }}
>
  ⭐ {avgRating}
  {" "}
  ({reviews.length} отзывов)
</div>

<div>
  📞
  {" "}
  {partner?.phone ||
    "Не указан"}
</div>

<div
  style={{
    marginTop: 8,
  }}
>
  📍
  {" "}
  {partner?.address ||
    "Не указан"}
</div>

<button
  onClick={openRoute}
  style={{
    marginTop: 10,
    padding: 10,
  }}
>
  📍 Маршрут
</button>
      <div
        style={{
          color: "#16a34a",
          fontWeight: 700,
          marginBottom: 10,
        }}
      >
        🎁 Скидка{" "}
        {partner?.discount_percent ||
          0}
        %
      </div>
{canReview && (
  <div
    style={{
      border:
        "1px solid #ddd",
      borderRadius: 12,
      padding: 12,
      marginTop: 20,
      marginBottom: 20,
    }}
  >
    <h3>
      Оставить отзыв
    </h3>

    <select
      value={rating}
      onChange={(e) =>
        setRating(
          Number(
            e.target.value
          )
        )
      }
    >
      <option value={5}>
        ⭐⭐⭐⭐⭐
      </option>

      <option value={4}>
        ⭐⭐⭐⭐
      </option>

      <option value={3}>
        ⭐⭐⭐
      </option>

      <option value={2}>
        ⭐⭐
      </option>

      <option value={1}>
        ⭐
      </option>
    </select>

    <textarea
      value={reviewText}
      onChange={(e) =>
        setReviewText(
          e.target.value
        )
      }
      placeholder="Ваш отзыв"
      style={{
        width: "100%",
        minHeight: 100,
        marginTop: 10,
      }}
    />

    <button
      onClick={
        submitReview
      }
      style={{
        width: "100%",
        marginTop: 10,
      }}
    >
      Отправить отзыв
    </button>
  </div>
)}
      <LocationGuard
        partner={partner}
        maxDistance={300}
        onAccessChange={
          setCanOrder
        }
      />
{canOrder && (
  <div
    style={{
      border: "1px solid #eee",
      borderRadius: 12,
      padding: 12,
      marginTop: 15,
      marginBottom: 15,
    }}
  >
    <h3>Способ получения</h3>

    <label>
      <input
        type="radio"
        checked={serviceType === "table"}
        onChange={() =>
          setServiceType("table")
        }
      />
      За столиком
    </label>

    <br />

    <label>
      <input
        type="radio"
        checked={serviceType === "takeaway"}
        onChange={() =>
          setServiceType("takeaway")
        }
      />
      Самовывоз
    </label>

    {serviceType === "table" && (
      <div style={{ marginTop: 10 }}>
        <input
          type="text"
          placeholder="Номер столика"
          value={tableNumber}
          onChange={(e) =>
            setTableNumber(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: 10,
          }}
        />
      </div>
    )}
  </div>
)}
<button
  onClick={() =>
    setShowReviews(
      !showReviews
    )
  }
  style={{
    marginTop: 20,
    marginBottom: 20,
  }}
>
  Отзывы
  {" "}
  ({reviews.length})
</button>

{showReviews &&
  reviews.map(
    (review) => (
      <div
        key={review.id}
        style={{
          border:
            "1px solid #eee",
          borderRadius: 12,
          padding: 12,
          marginBottom: 10,
        }}
      >
        <div>
          👤
          {" "}
          {review.client_name}
        </div>

        <div>
         {"⭐".repeat(
  Number(review.rating || 0)
)}
        </div>

        <div>
          {review.review_text}
        </div>
      </div>
    )
  )}
      <h3
        style={{
          marginTop: 20,
        }}
      >
        Меню
      </h3>

      {products.length ===
        0 && (
        <div>
          Товары отсутствуют
        </div>
      )}

      {products.map((item) => (
        <div
          key={item.id}
          style={{
            border:
              "1px solid #eee",
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          {item.photo_url && (
            <img
              src={
                item.photo_url
              }
              alt={item.name}
              style={{
                width: "100%",
                borderRadius: 10,
                marginBottom: 10,
              }}
            />
          )}

          <strong>
            {item.name}
          </strong>

          <div>
            {Number(
              item.price || 0
            ).toLocaleString()}{" "}
            VND
          </div>

          <div>
            {item.description}
          </div>

          {canOrder && (
            <button
              onClick={() =>
                addToCart(
                  item
                )
              }
              style={{
                width: "100%",
                marginTop: 10,
                padding: 10,
              }}
            >
              🛒 Добавить
            </button>
          )}
        </div>
      ))}

      <CartPanel
        cart={cart}
        partner={partner}
        onIncrease={
          increaseQuantity
        }
        onDecrease={
          decreaseQuantity
        }
        onSubmitOrder={
          submitOrder
        }
        loading={loading}
      />
    </div>
  );
}