import React, { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function QRScanner({
  onScanSuccess,
}) {
  useEffect(() => {
    const scanner =
      new Html5QrcodeScanner(
        "reader",
        {
          fps: 10,
          qrbox: 250,
          videoConstraints: {
            facingMode: {
              exact: "environment",
            },
          },
        },
        false
      );

    scanner.render(
      (decodedText) => {
        try {
          const parsed =
            JSON.parse(decodedText);

          onScanSuccess(parsed);
        } catch (e) {
          console.log(
            "QR parse error",
            e
          );
        }
      },
      (error) => {
        // не засоряем консоль
      }
    );

    return () => {
      scanner.clear().catch(() => {});
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