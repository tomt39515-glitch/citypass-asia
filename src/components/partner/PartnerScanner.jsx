import React, { useState } from "react";
import QRScanner from "../QRScanner";

export default function PartnerScanner() {
  const [message, setMessage] = useState("");

  return (
    <div style={{ padding: 30 }}>
      <h1>Партнёр CityPass</h1>

      <QRScanner
        onScanSuccess={({ token }) => {
          setMessage(
            "QR считан успешно: " + token
          );
        }}
      />

      <p style={{ marginTop: 20 }}>
        {message}
      </p>
    </div>
  );
}