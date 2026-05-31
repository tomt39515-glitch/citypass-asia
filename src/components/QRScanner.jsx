import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({
  onScanSuccess,
}) {
  useEffect(() => {
    const html5QrCode =
      new Html5Qrcode("reader");

    const startScanner = async () => {
      try {
        await html5QrCode.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: {
              width: 250,
              height: 250,
            },
          },
          (decodedText) => {
            console.log(
              "QR SUCCESS:",
              decodedText
            );

            onScanSuccess({
              token: decodedText,
            });

            html5QrCode
              .stop()
              .catch(() => {});
          },
          () => {}
        );
      } catch (err) {
        console.error(
          "QR START ERROR:",
          err
        );
      }
    };

    startScanner();

    return () => {
      html5QrCode
        .stop()
        .catch(() => {});
    };
  }, [onScanSuccess]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "420px",
        borderRadius: "28px",
        overflow: "hidden",
        background: "#000",
      }}
    >
      <div
        id="reader"
        style={{
          width: "100%",
          height: "100%",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform:
            "translate(-50%, -50%)",
          width: "240px",
          height: "240px",
          border:
            "4px solid rgba(255,255,255,0.9)",
          borderRadius: "28px",
          boxShadow:
            "0 0 0 9999px rgba(0,0,0,0.45)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: 0,
          right: 0,
          textAlign: "center",
          color: "#fff",
          fontWeight: 600,
          fontSize: "15px",
          pointerEvents: "none",
        }}
      >
        Наведите QR-код внутрь рамки
      </div>
    </div>
  );
}