import React, { useMemo, useState } from "react";
import vietqr from "../assets/vietqr.png";

const SUPABASE_URL = "https://doswzyuumcwxjmltcgeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_5_sw0Rk7sPg-SMTgI1aTkA_Vb5QAZRP";

function generatePaymentCode(partnerId) {
  return `CP_TOPUP_${partnerId}_${Date.now()}`;
}

export default function PartnerTopupPage({
  partner,
  onBack,
  onSuccess,
}) {
  const [amount, setAmount] = useState(1000000);
  const [screenshot, setScreenshot] = useState(null);
  const [loading, setLoading] = useState(false);

  const paymentCode = useMemo(() => {
    return generatePaymentCode(partner.id);
  }, [partner.id]);

  async function uploadScreenshot(file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `proof-${Date.now()}.${fileExt}`;

    const response = await fetch(
      `${SUPABASE_URL}/storage/v1/object/payment-proofs/${fileName}`,
      {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": file.type,
        },
        body: file,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Ошибка загрузки скрина");
    }

    return `${SUPABASE_URL}/storage/v1/object/public/payment-proofs/${fileName}`;
  }

  async function submitTopup() {
    try {
      setLoading(true);

      let screenshotUrl = null;

      if (screenshot) {
        screenshotUrl = await uploadScreenshot(screenshot);
      }

      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/deposit_topups`,
        {
          method: "POST",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
          },
          body: JSON.stringify([
            {
              partner_id: partner.id,
              amount,
              payment_code: paymentCode,
              screenshot_url: screenshotUrl,
              payment_submitted: true,
              submitted_at: new Date().toISOString(),
            },
          ]),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Ошибка отправки заявки");
      }

      alert("Заявка на пополнение отправлена");
      onSuccess?.();
    } catch (e) {
      console.error(e);
      alert(e.message || "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 480,
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <button
        onClick={onBack}
        style={{
          marginBottom: 20,
          padding: 10,
          borderRadius: 10,
          border: "none",
          background: "#e5e7eb",
          cursor: "pointer",
        }}
      >
        ← Назад
      </button>

      <h1>Пополнение депозита</h1>

      <p>Выберите сумму:</p>

      <select
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={{
          width: "100%",
          padding: 14,
          borderRadius: 14,
          marginBottom: 20,
          fontSize: 16,
        }}
      >
        <option value={500000}>500,000 VND</option>
        <option value={1000000}>1,000,000 VND</option>
        <option value={2000000}>2,000,000 VND</option>
        <option value={5000000}>5,000,000 VND</option>
      </select>

      <img
        src={vietqr}
        alt="VietQR"
        style={{
          width: "100%",
          borderRadius: 16,
          marginBottom: 20,
        }}
      />

      <div
        style={{
          background: "#f3f4f6",
          padding: 14,
          borderRadius: 14,
          marginBottom: 20,
          fontSize: 15,
        }}
      >
        Код платежа:
        <br />
        <strong>{paymentCode}</strong>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setScreenshot(e.target.files[0])}
        style={{
          width: "100%",
          marginBottom: 20,
        }}
      />

      <button
        onClick={submitTopup}
        disabled={loading}
        style={{
          width: "100%",
          padding: 16,
          borderRadius: 16,
          border: "none",
          background: "#16a34a",
          color: "white",
          fontSize: 16,
          cursor: "pointer",
        }}
      >
        {loading ? "Отправка..." : "Я оплатил"}
      </button>
    </div>
  );
}