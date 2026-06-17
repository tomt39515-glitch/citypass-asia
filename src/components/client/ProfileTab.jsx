import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function ProfileTab({
  role,
  setRole,
  userRoles = [],
}) {
  const [preferredLanguage, setPreferredLanguage] =
    useState("en");

  useEffect(() => {
    loadClientLanguage();
  }, []);

  async function loadClientLanguage() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId) return;

      const { data } = await supabase
        .from("clients")
        .select("preferred_language")
        .eq("telegram_id", String(telegramId))
        .single();

      if (data?.preferred_language) {
        setPreferredLanguage(data.preferred_language);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function saveLanguage() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId) return;

      const { error } = await supabase
        .from("clients")
        .update({
          preferred_language: preferredLanguage,
        })
        .eq("telegram_id", String(telegramId));

      if (error) throw error;

      alert("Язык сохранён");
    } catch (err) {
      alert(err.message);
    }
  }

  return (


    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg,#14B8A6,#0F766E)",
          borderRadius: "28px",
          padding: "24px",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            opacity: 0.9,
          }}
        >
          CITYPASS ASIA
        </div>

        <div
          style={{
            marginTop: "12px",
            fontSize: "28px",
            fontWeight: 800,
          }}
        >
          Участник клуба
        </div>

        <div
          style={{
            marginTop: "12px",
            display: "inline-block",
            background:
              "rgba(255,255,255,.18)",
            padding: "8px 14px",
            borderRadius: "999px",
          }}
        >
          Активный статус
        </div>

        <div
          style={{
            marginTop: "24px",
            opacity: 0.9,
          }}
        >
          ID: CPA-000001
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Экономия
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "24px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            750 000 ₫
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Скидок
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "24px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            341
          </div>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        {[
          "Мои данные",
          "Мои скидки",
          "Избранные партнёры",
          "Уведомления",
          "Поддержка",
          "О CityPass Asia",
        ].map((item, index, array) => (
          <div
            key={item}
            style={{
              padding: "18px 20px",
              borderBottom:
                index !== array.length - 1
                  ? "1px solid #F1F5F9"
                  : "none",
              cursor: "pointer",
              color: "#0F172A",
              fontWeight: 500,
            }}
          >
            {item}
          </div>
        ))}
      </div>

     <div
  style={{
    background: "#fff",
    borderRadius: "24px",
    padding: "20px",
  }}
>

  <div style={{ marginBottom: "20px" }}>
    <div
      style={{
        fontWeight: 700,
        marginBottom: "12px",
      }}
    >
      🌐 Язык общения
    </div>

    <select
      value={preferredLanguage}
      onChange={(e) =>
        setPreferredLanguage(e.target.value)
      }
      style={{
        width: "100%",
        padding: "12px",
        borderRadius: "12px",
        border: "1px solid #CBD5E1",
      }}
    >
      <option value="vi">🇻🇳 Tiếng Việt</option>
      <option value="en">🇺🇸 English</option>
      <option value="ru">🇷🇺 Русский</option>
      <option value="zh">🇨🇳 中文</option>
      <option value="ko">🇰🇷 한국어</option>
      <option value="ja">🇯🇵 日本語</option>
      <option value="tr">🇹🇷 Türkçe</option>
      <option value="fr">🇫🇷 Français</option>
      <option value="de">🇩🇪 Deutsch</option>
      <option value="es">🇪🇸 Español</option>
      <option value="it">🇮🇹 Italiano</option>
      <option value="pt">🇵🇹 Português</option>
    </select>

    <button
      onClick={saveLanguage}
      style={{
        width: "100%",
        marginTop: "12px",
        border: "none",
        borderRadius: "12px",
        padding: "14px",
        background:
          "linear-gradient(135deg,#14B8A6,#0D9488)",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      💾 Сохранить язык
    </button>
  </div>

  <div
    style={{
      fontWeight: 700,
      marginBottom: "14px",
      color: "#0F172A",
    }}
  >
    Мой статус
  </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {userRoles.map((item) => (
            <button
              key={item}
              onClick={() => setRole(item)}
              style={{
                border: "none",
                borderRadius: "16px",
                padding: "14px",
                cursor: "pointer",
                fontWeight: 600,
                background:
                  role === item
                    ? "#14B8A6"
                    : "#F1F5F9",
                color:
                  role === item
                    ? "#FFFFFF"
                    : "#0F172A",
              }}
            >
              {item === "client" && "Клиент"}
              {item === "partner" && "Партнёр"}
              {item === "agent" && "Агент"}
              {item === "admin" &&
                "Администратор"}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent(
                "open-partner-registration"
              )
            )
          }
          style={{
            width: "100%",
            marginTop: "16px",
            border: "none",
            borderRadius: "16px",
            padding: "16px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "16px",
            background:
              "linear-gradient(135deg,#14B8A6,#0D9488)",
            color: "#fff",
          }}
        >
          Стать партнёром CityPass
        </button>

        <button
          onClick={() =>
            alert(
              "Форма агента будет подключена следующим этапом"
            )
          }
          style={{
            width: "100%",
            marginTop: "10px",
            border: "none",
            borderRadius: "16px",
            padding: "16px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "16px",
            background:
              "linear-gradient(135deg,#0F766E,#115E59)",
            color: "#fff",
          }}
        >
          Стать агентом CityPass
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "20px",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          Поддержка CityPass
        </div>

        <div
          style={{
            color: "#64748B",
          }}
        >
          support@citypass.asia
        </div>
      </div>
    </div>
  );
}