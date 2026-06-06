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

  useEffect(() => {
    loadProducts();
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

  async function submitOrder() {
    try {
      if (!cart.length) {
        alert(
          "Корзина пуста"
        );
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
        "Ошибка создания заказа"
      );
    } finally {
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

      <LocationGuard
        partner={partner}
        maxDistance={50}
        onAccessChange={
          setCanOrder
        }
      />

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