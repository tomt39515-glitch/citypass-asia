import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";

export default function PartnerProfileTab({ onOpenTopup }) {
  const [partner, setPartner] = useState(null);
  const [description, setDescription] = useState("");
const [workingHours, setWorkingHours] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");
  const [paymentQrUrl, setPaymentQrUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadPartner();
  }, []);

  async function loadPartner() {
    try {
      const telegramId =
        window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

      if (!telegramId) return;

      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("telegram_id", Number(telegramId))
        .order("id", { ascending: false })
        .limit(1);

      if (error) throw error;
      if (!data || data.length === 0) return;

      const currentPartner = data[0];

      setPartner(currentPartner);
      setDescription(currentPartner.description || "");
setWorkingHours(currentPartner.working_hours || "");
      setLatitude(currentPartner.latitude || "");
      setLongitude(currentPartner.longitude || "");
      setCoverPhotoUrl(currentPartner.cover_photo_url || "");
      setPaymentQrUrl(currentPartner.payment_qr_url || "");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  }

  function detectLocation() {
    if (!navigator.geolocation) {
      alert("Геолокация не поддерживается");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        alert(error.message);
      }
    );
  }

  async function uploadPhoto(event) {
    try {
      const file = event.target.files?.[0];
      if (!file || !partner) return;

      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `${partner.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("partner-images")
        .upload(fileName, file, {
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("partner-images")
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("partners")
        .update({
          cover_photo_url: publicUrl,
        })
        .eq("id", partner.id);

      if (updateError) throw updateError;

      setCoverPhotoUrl(publicUrl);

      alert("Фото загружено");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }


  async function uploadPaymentQr(event) {
    try {
      const file = event.target.files?.[0];
      if (!file || !partner) return;

      setUploading(true);

      const fileExt = file.name.split(".").pop();
      const fileName = `qr_${partner.id}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("partner-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("partner-images")
        .getPublicUrl(fileName);

      const publicUrl = data.publicUrl;

      const { error: updateError } = await supabase
        .from("partners")
        .update({
          payment_qr_url: publicUrl,
        })
        .eq("id", partner.id);

      if (updateError) throw updateError;

      setPaymentQrUrl(publicUrl);

      alert("QR-код оплаты загружен");
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }


  async function saveProfile() {
    if (!partner) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from("partners")
        .update({
  description,
  working_hours: workingHours,
  latitude: latitude || null,
  longitude: longitude || null,
})
        .eq("id", partner.id);

      if (error) throw error;

      alert("Профиль сохранён");
      await loadPartner();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setSaving(false);
    }
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
        <h2 style={{ marginTop: 0 }}>Профиль бизнеса</h2>

        {coverPhotoUrl && (
          <img
            src={coverPhotoUrl}
            alt="business"
            style={{
              width: "100%",
              borderRadius: "16px",
              marginBottom: "12px",
              maxHeight: "220px",
              objectFit: "cover",
            }}
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={uploadPhoto}
          disabled={uploading}
          style={{ marginBottom: "16px" }}
        />

        <div style={{ marginBottom: "20px" }}>
          <h3>💳 QR-код оплаты</h3>

          {paymentQrUrl && (
            <img
              src={paymentQrUrl}
              alt="payment qr"
              style={{
                width: "220px",
                borderRadius: "12px",
                marginBottom: "12px",
              }}
            />
          )}

          <input
            type="file"
            accept="image/*"
            onChange={uploadPaymentQr}
            disabled={uploading}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <b>Название:</b><br />
          {partner?.business_name || "-"}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <b>Телефон:</b><br />
          {partner?.phone || "-"}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <b>Категория:</b><br />
          {partner?.category || "-"}
        </div>

   <div style={{ marginBottom: "12px" }}>
  <b>Описание бизнеса</b>

  <textarea
    value={description}
    onChange={(e) => setDescription(e.target.value)}
    style={{
      width: "100%",
      minHeight: "100px",
      marginTop: "8px",
      borderRadius: "12px",
      padding: "12px",
      border: "1px solid #CBD5E1",
      boxSizing: "border-box",
    }}
  />
</div>

<div style={{ marginBottom: "12px" }}>
  <b>Часы работы</b>

  <input
    value={workingHours}
    onChange={(e) => setWorkingHours(e.target.value)}
    placeholder="08:00 - 22:00"
    style={{
      width: "100%",
      marginTop: "8px",
      borderRadius: "12px",
      padding: "12px",
      border: "1px solid #CBD5E1",
      boxSizing: "border-box",
    }}
  />
</div>

        <div style={{ marginBottom: "12px" }}>
          <b>Latitude:</b><br />
          {latitude || "-"}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <b>Longitude:</b><br />
          {longitude || "-"}
        </div>

        <button
          onClick={detectLocation}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "12px",
            border: "none",
            borderRadius: "14px",
            background: "#0EA5E9",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          📍 Определить локацию
        </button>

        <button
          onClick={saveProfile}
          disabled={saving}
          style={{
            width: "100%",
            padding: "14px",
            marginBottom: "20px",
            border: "none",
            borderRadius: "14px",
            background:
              "linear-gradient(135deg,#14B8A6,#0D9488)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {saving ? "Сохранение..." : "💾 Сохранить"}
        </button>

        <div style={{ marginBottom: "12px" }}>
          <b>Депозит:</b><br />
          {Number(partner?.deposit_balance || 0).toLocaleString()} ₫
        </div>

        <div style={{ marginBottom: "12px" }}>
          <b>Бонусный баланс:</b><br />
          {Number(partner?.bonus_balance || 0).toLocaleString()} ₫
        </div>

        <div>
          <b>Статус:</b><br />
          {partner?.status || "active"}
        </div>
      </div>
    </div>
  );
}
