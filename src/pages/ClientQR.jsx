import QRCode from "qrcode";
import { useEffect, useState } from "react";

export default function ClientQR() {
  const [telegramId, setTelegramId] = useState(null);
  const [token, setToken] = useState("");
  const [qrImage, setQrImage] = useState("");
  const [seconds, setSeconds] = useState(60);
  const [error, setError] = useState("");

  useEffect(() => {
    const tg =
      window.Telegram?.WebApp?.initDataUnsafe;

    const id =
      tg?.user?.id ||
      tg?.receiver?.id ||
      null;

    setTelegramId(id);
  }, []);

  async function generateQR() {
    try {
      setError("");

      if (!telegramId) {
        setError("Telegram ID не найден");
        return;
      }

      const response = await fetch(
        "https://doswzyuumcwxjmltcgeh.supabase.co/functions/v1/generate-client-qr",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            telegram_id: telegramId,
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "QR RESPONSE:",
        data
      );

      if (!data.success) {
        setError(
          data.error ||
            "Ошибка генерации QR"
        );
        return;
      }

      setToken(data.token);

      const image =
        await QRCode.toDataURL(
          data.token
        );

      setQrImage(image);
      setSeconds(60);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Ошибка загрузки QR"
      );
    }
  }

  useEffect(() => {
    if (!telegramId) return;

    generateQR();
  }, [telegramId]);

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
        minHeight: "100vh",
        background: "#f4f7fb",
        padding: "20px",
        fontFamily:
          "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          margin: "0 auto",
          background: "#fff",
          padding: "24px",
          borderRadius: "24px",
          boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1>Мой QR-код</h1>

        <p
          style={{
            color: "#666",
            marginBottom: "20px",
          }}
        >
          Покажите QR партнёру
        </p>

        <div
          style={{
            marginBottom: "20px",
            color: "#2563eb",
            fontWeight: "700",
          }}
        >
          Telegram ID:{" "}
          {String(telegramId)}
        </div>

        {error && (
          <div
            style={{
              background:
                "#fee2e2",
              color: "#dc2626",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "15px",
            }}
          >
            {error}
          </div>
        )}

        {!qrImage && !error && (
          <div
            style={{
              height: "240px",
              display: "flex",
              alignItems: "center",
              justifyContent:
                "center",
            }}
          >
            Загрузка QR...
          </div>
        )}

        {qrImage && (
          <img
            src={qrImage}
            alt="QR"
            style={{
              width: "240px",
              height: "240px",
              margin: "0 auto",
              display: "block",
              borderRadius: "20px",
            }}
          />
        )}

        <div
          style={{
            marginTop: "20px",
            fontSize: "22px",
            fontWeight: "700",
            color: "#2563eb",
          }}
        >
          {seconds} сек
        </div>

        <button
          onClick={generateQR}
          style={{
            marginTop: "20px",
            padding:
              "12px 24px",
            border: "none",
            borderRadius:
              "12px",
            background:
              "#2563eb",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Обновить QR
        </button>
      </div>
    </div>
  );
}