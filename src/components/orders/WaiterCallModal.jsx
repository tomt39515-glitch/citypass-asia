import React, { useState } from "react";
import { supabase } from "../../supabase";

export default function WaiterCallModal({
  isOpen,
  order,
  partner,
  clientId,
  onClose,
}) {
  const [reason, setReason] =
    useState("bill");

  const [loading, setLoading] =
    useState(false);

  if (!isOpen) return null;

  async function sendCall() {
    try {
      setLoading(true);

      const { error } =
        await supabase
          .from("waiter_calls")
          .insert({
            partner_id:
              partner.id,

            client_id:
              clientId,

            order_id:
              order?.id || null,

            reason,

            status: "new",
          });

      if (error) throw error;

      alert(
        "Официант вызван"
      );

      onClose();
    } catch (err) {
      console.error(err);

      alert(
        "Ошибка вызова"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent:
          "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 20,
          width: "90%",
          maxWidth: 420,
        }}
      >
        <h3>
          🔔 Позвать официанта
        </h3>

        <select
          value={reason}
          onChange={(e) =>
            setReason(
              e.target.value
            )
          }
          style={{
            width: "100%",
            padding: 12,
            marginTop: 10,
          }}
        >
          <option value="bill">
            Принести счёт
          </option>

          <option value="help">
            Нужна помощь
          </option>

          <option value="order">
            Хочу сделать заказ
          </option>

          <option value="other">
            Другое
          </option>
        </select>

        <button
          onClick={sendCall}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: 16,
            padding: 12,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: 10,
          }}
        >
          Отправить
        </button>

        <button
          onClick={onClose}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 12,
          }}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}