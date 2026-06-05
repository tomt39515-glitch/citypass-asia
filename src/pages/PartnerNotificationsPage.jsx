import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerNotificationsTab() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId) {
        setLoading(false);
        return;
      }

      const { data: partners } = await supabase
        .from("partners")
        .select("*")
        .eq("telegram_id", Number(telegramId))
        .order("id", { ascending: false })
        .limit(1);

      if (!partners || partners.length === 0) {
        setLoading(false);
        return;
      }

      const partner = partners[0];

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_type", "partner")
        .eq("user_id", partner.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setNotifications(data || []);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
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
          🔔 Уведомления
        </h2>

        {loading ? (
          <p>Загрузка...</p>
        ) : notifications.length === 0 ? (
          <p>Уведомлений пока нет.</p>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              style={{
                padding: "12px",
                marginBottom: "12px",
                borderRadius: "12px",
                background: item.is_read
                  ? "#F8FAFC"
                  : "#ECFEFF",
                border: "1px solid #E2E8F0",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: "6px",
                }}
              >
                {item.title}
              </div>

              <div>{item.message}</div>

              <div
                style={{
                  marginTop: "8px",
                  fontSize: "12px",
                  color: "#64748B",
                }}
              >
                {new Date(
                  item.created_at
                ).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
