import React, {
  useEffect,
  useState,
} from "react";

import { supabase } from "../supabase";
import ProductModal from "../components/orders/ProductModal";
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
const [
  selectedProduct,
  setSelectedProduct,
] = useState(null);

const [showCartSheet, setShowCartSheet] =
  useState(false);
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
function getCartQuantity(productId) {

  const item = cart.find(

    (x) => x.id === productId

  );



  return item?.quantity || 0;

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

      const { data: existingOrder } =
        await supabase
          .from("orders")
          .select("*")
          .eq("client_id", client.id)
          .eq("partner_id", partner.id)
          .eq("service_type", "table")
          .eq("bill_status", "open")
          .maybeSingle();

      if (
        serviceType === "table" &&
        existingOrder
      ) {
        const items = cart.map((item) => ({
          order_id: existingOrder.id,
          item_id: item.id,
          item_name_snapshot: item.name,
          unit_price: item.price,
          quantity: item.quantity,
          total_price:
            item.price * item.quantity,
        }));

        await supabase
          .from("order_items")
          .insert(items);

        await supabase
          .from("orders")
          .update({
            subtotal:
              Number(existingOrder.subtotal || 0) +
              subtotal,
            discount_amount:
              Number(existingOrder.discount_amount || 0) +
              discountAmount,
            total_amount:
              Number(existingOrder.total_amount || 0) +
              totalAmount,
            current_table_number:
              tableNumber,
          })
          .eq("id", existingOrder.id);

        alert("Дозаказ отправлен");
        setCart([]);
        return;
      }

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

          bill_status:
            "open",

          current_table_number:
            serviceType === "table"
              ? tableNumber
              : null,
        })
        .select()
        .single();

      if (orderError)
        throw orderError;

      try {
        console.log("ORDER CREATED", {
          partner_id: partner.id,
          order_number: orderNumber,
          total_amount: totalAmount,
        });

        const response = await fetch(
          "https://doswzyuumcwxjmltcgeh.supabase.co/functions/v1/send-telegram-notification",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvc3d6eXV1bWN3eGptbHRjZ2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTMwNzUsImV4cCI6MjA5NTEyOTA3NX0.y0CUPEoH7QZl0VbBBiugoHb2qHwx7m1olXM3GDlrPCc",
                          },
            body: JSON.stringify({
              chat_id: "8052071718",
              text: `Новый заказ ${orderNumber}`,
            }),
          }
        );

        console.log(
          "TELEGRAM RESPONSE",
          await response.text()
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
     <div
  style={{
    position: "relative",
    marginBottom: 20,
  }}
>
  <img
    src={partner?.cover_photo_url}
    alt={partner?.business_name}
    style={{
      width: "100%",
      height: 300,
      objectFit: "cover",
      borderRadius: 24,
    }}
  />

  <div
    style={{
      position: "absolute",
      inset: 0,
      borderRadius: 24,
      background:
        "linear-gradient(to top, rgba(0,95,95,.85), rgba(0,95,95,.15))",
    }}
  />

  <button
    onClick={onBack}
    style={{
      position: "absolute",
      top: 16,
      left: 16,
      border: "none",
      background: "rgba(255,255,255,.9)",
      padding: "10px 16px",
      borderRadius: 999,
      fontWeight: 600,
      cursor: "pointer",
    }}
  >
    ← Назад
  </button>

  <div
    style={{
      position: "absolute",
      top: 16,
      right: 16,
      background: "#ECD06F",
      padding: "10px 16px",
      borderRadius: 999,
      fontWeight: 800,
    }}
  >
    CLUB
  </div>

  <div
    style={{
      position: "absolute",
      left: 20,
      right: 20,
      bottom: 20,
      color: "#fff",
    }}
  >
    <div
      style={{
        fontSize: 30,
        fontWeight: 800,
      }}
    >
      {partner?.business_name}
    </div>

    <div
      style={{
        marginTop: 8,
        fontSize: 15,
      }}
    >
      ⭐ {avgRating} ({reviews.length} отзывов)
    </div>

    <div
      style={{
        marginTop: 6,
        fontSize: 16,
        fontWeight: 700,
      }}
    >
      🎁 Скидка {partner?.discount_percent || 0}%
    </div>
  </div>
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
          type="number"
          inputMode="numeric"
          placeholder="Номер столика"
          value={tableNumber}
          onChange={(e) =>
            setTableNumber(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: 14,
            fontSize: 16,
            borderRadius: 12,
            border: "1px solid #ddd",
            boxSizing: "border-box",
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
<div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0,1fr))",
    gap: 12,
  }}
>
{products.map((item) => (
  <div
    key={item.id}

    style={{
      background: "#fff",
      borderRadius: 20,
      overflow: "hidden",
      boxShadow:
        "0 4px 15px rgba(0,0,0,.06)",
      display: "flex",
      flexDirection: "column",
      height: "100%",
    }}
  >
        
       <div
  style={{
    position: "relative",
  }}
>
  {item.photo_url && (
    <img
      src={item.photo_url}
      alt={item.name}
      style={{
        width: "100%",
        height: 160,
        objectFit: "cover",
        display: "block",
        filter:
          getCartQuantity(item.id) > 0
            ? "brightness(0.45)"
            : "none",
        transition: "0.25s",
      }}
    />
  )}

  {getCartQuantity(item.id) > 0 && (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 999,
          padding: "8px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow:
            "0 8px 20px rgba(0,0,0,.25)",
        }}
      >
        <button
          onClick={() =>
            decreaseQuantity(item.id)
          }
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "#22c7b8",
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          −
        </button>

        <strong
          style={{
            color: "#0b8f88",
            fontSize: 18,
          }}
        >
          {getCartQuantity(item.id)}
        </strong>

        <button
          onClick={() =>
            increaseQuantity(item.id)
          }
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "none",
            background: "#22c7b8",
            color: "#fff",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          +
        </button>
      </div>
    </div>
  )}

 <button
  onClick={() =>
    setSelectedProduct(item)
  }
  style={{
    position: "absolute",
    top: 10,
    right: 10,
    width: 24,
    height: 24,
    border: "1px solid #22c7b8",
    borderRadius: "50%",
    background: "rgba(255,255,255,.92)",
    color: "#22c7b8",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    
  }}
>
  i
</button>
</div>

<div
  style={{
    padding: 14,
    display: "flex",
    flexDirection: "column",
    flex: 1,
position: "relative",
  }}
>

<div
  style={{
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 6,
    minHeight: 52,
    display: "flex",
    alignItems: "flex-start",
  }}
>
  {item.name}
</div>

     <div
  style={{
    color: "#0b8f88",
    fontSize: 20,
    fontWeight: 800,
    marginTop: "auto",
    paddingTop: 10,
  }}
>
  {Number(item.price || 0).toLocaleString()} ₫
</div>

          {canOrder &&
  getCartQuantity(item.id) === 0 && (
   <button
  onClick={() => addToCart(item)}
  style={{
    position: "absolute",
    right: 14,
    bottom: 14,
    width: 42,
    height: 42,
    borderRadius: "50%",
    border: "none",
    background:
      "linear-gradient(135deg,#22c7b8,#0b8f88)",
    color: "#fff",
    fontSize: 26,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow:
      "0 6px 15px rgba(11,143,136,.35)",
  }}
>
  +
</button>
)}
</div>
</div>
))}
</div>
{selectedProduct && (
  <ProductModal
    product={selectedProduct}
    onClose={() =>
      setSelectedProduct(null)
    }
    onAdd={addToCart}
  />
)}

{cart.length > 0 && (
  <>
    <div
      onClick={() => setShowCartSheet(true)}
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 90,
        background:
          "linear-gradient(135deg,#22c7b8,#0b8f88)",
        color: "#fff",
        borderRadius: 18,
        padding: "14px 18px",
        fontWeight: 700,
        zIndex: 1000,
        display: "flex",
        justifyContent: "space-between",
        boxShadow:
          "0 10px 25px rgba(11,143,136,.35)",
      }}
    >
      <span>🛒 Корзина ({cart.length})</span>
      <span>
        {cart.reduce((s,i)=>s+i.price*i.quantity,0).toLocaleString()} ₫
      </span>
    </div>

    {showCartSheet && (
      <div
        onClick={() => setShowCartSheet(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.5)",
          zIndex: 2000,
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          onClick={(e)=>e.stopPropagation()}
          style={{
            background:"#fff",
            width:"100%",
            borderTopLeftRadius:24,
            borderTopRightRadius:24,
            padding:16,
            maxHeight:"80vh",
            overflowY:"auto",
          }}
        >
          <CartPanel
            cart={cart}
            partner={partner}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onSubmitOrder={submitOrder}
            loading={loading}
          />
        </div>
      </div>
    )}
  </>
)}
    </div>
  );
}