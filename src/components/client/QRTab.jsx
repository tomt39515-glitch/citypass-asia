import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function QRTab() {
  const telegramId =
    window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const [token, setToken] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [seconds, setSeconds] = useState(60);

  async function generateQR() {
    try {
      if (!telegramId) {
        console.error("Telegram ID not found");
        return;
      }

      const response = await fetch(
        "https://doswzyuumcwxjmltcgeh.supabase.co/functions/v1/generate-client-qr",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegram_id: telegramId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setToken(data.token);

        const image = await QRCode.toDataURL(
          data.token
        );

        setQrImage(image);
        setSeconds(60);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error("QR Error:", err);
    }
  }

  useEffect(() => {
    generateQR();
  }, []);

  useEffect(() => {
    if (!token) return;

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          generateQR();
          return 60;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [token]);

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        padding: "16px",
        paddingBottom: "100px",
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
            fontSize: "26px",
            fontWeight: 700,
          }}
        >
          Участник клуба
        </div>

        <div
          style={{
            marginTop: "12px",
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: "999px",
            background:
              "rgba(255,255,255,.15)",
          }}
        >
          Активный статус
        </div>

        <div
          style={{
            marginTop: "28px",
            opacity: 0.85,
          }}
        >
          Telegram ID: {telegramId}
        </div>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          borderRadius: "28px",
          padding: "24px",
          textAlign: "center",
          boxShadow:
            "0 10px 25px rgba(15,23,42,.05)",
        }}
      >
        <h2 style={{ marginTop: 0 }}>
          Мой QR-код
        </h2>

        <div
          style={{
            color: "#64748B",
            marginBottom: "20px",
          }}
        >
          Покажите код партнёру для получения скидки
        </div>

        <div
          style={{
            width: "280px",
            minHeight: "280px",
            margin: "0 auto",
            background: "#F8FAFC",
            borderRadius: "24px",
            border: "1px solid #E2E8F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "12px",
          }}
        >
          {qrImage ? (
            <img
              src={qrImage}
              alt="QR"
              style={{
                width: "240px",
                height: "240px",
              }}
            />
          ) : (
            <div>Загрузка QR...</div>
          )}
        </div>

        <div
          style={{
            marginTop: "16px",
            fontSize: "18px",
            fontWeight: "700",
            color: "#14B8A6",
          }}
        >
          Обновление через {seconds} сек
        </div>

        <button
          onClick={generateQR}
          style={{
            marginTop: "20px",
            width: "100%",
            border: "none",
            borderRadius: "18px",
            padding: "16px",
            background:
              "linear-gradient(135deg,#14B8A6,#0D9488)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Обновить QR
        </button>
      </div>
    </div>
  );
}