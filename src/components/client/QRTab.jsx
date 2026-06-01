import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function QRTab() {
  const telegramId =
    window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const [token, setToken] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [loading, setLoading] = useState(false);

  async function generateQR() {
    try {
      setLoading(true);

      if (!telegramId) {
        console.error("Telegram ID not found");
        return;
      }

      console.log(
        "GENERATE QR FOR TELEGRAM ID:",
        telegramId
      );

      const response = await fetch(
        "https://doswzyuumcwxjmltcgeh.supabase.co/functions/v1/generate-client-qr",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvc3d6eXV1bWN3eGptbHRjZ2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTMwNzUsImV4cCI6MjA5NTEyOTA3NX0.y0CUPEoH7QZl0VbBBiugoHb2qHwx7m1olXM3GDlrPCc",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRvc3d6eXV1bWN3eGptbHRjZ2VoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTMwNzUsImV4cCI6MjA5NTEyOTA3NX0.y0CUPEoH7QZl0VbBBiugoHb2qHwx7m1olXM3GDlrPCc",
          },
          body: JSON.stringify({
            telegram_id: telegramId,
          }),
        }
      );

      console.log(
        "RESPONSE STATUS:",
        response.status
      );

      const data = await response.json();

      console.log(
        "FUNCTION RESPONSE:",
        data
      );

      if (!data.success) {
        console.error(data.error);
        return;
      }

      setToken(data.token);

      const qr =
        await QRCode.toDataURL(data.token);

      setQrImage(qr);

      setSeconds(
        data.ttl_seconds || 60
      );
    } catch (error) {
      console.error(
        "QR ERROR:",
        error
      );
    } finally {
      setLoading(false);
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

    return () =>
      clearInterval(timer);
  }, [token]);

  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        padding: "16px",
        paddingBottom: "100px",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg,#14B8A6,#0F766E)",
          borderRadius: "28px",
          padding: "24px",
          color: "#fff",
          marginBottom: "20px",
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
            fontWeight: "700",
          }}
        >
          Участник клуба
        </div>

        <div
          style={{
            marginTop: "12px",
          }}
        >
          Telegram ID: {telegramId}
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: "28px",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <h2>Мой QR-код</h2>

        <p>
          Покажите QR партнёру
        </p>

        <div
          style={{
            width: "280px",
            height: "280px",
            margin: "0 auto",
            border: "1px solid #E2E8F0",
            borderRadius: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {loading ? (
            <div>
              Генерация QR...
            </div>
          ) : qrImage ? (
            <img
              src={qrImage}
              alt="QR"
              style={{
                width: "240px",
                height: "240px",
              }}
            />
          ) : (
            <div>
              QR не получен
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "20px",
            fontWeight: "700",
            fontSize: "18px",
            color: "#14B8A6",
          }}
        >
          Обновление через {seconds} сек
        </div>

        <button
          onClick={generateQR}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "16px",
            border: "none",
            borderRadius: "18px",
            background:
              "#14B8A6",
            color: "#fff",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Обновить QR
        </button>
      </div>
    </div>
  );
}