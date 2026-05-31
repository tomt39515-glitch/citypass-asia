import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({
  onScanSuccess,
}) {
  useEffect(() => {
    let scanner;

    async function startScanner() {
      try {
        scanner = new Html5Qrcode("reader");

        await scanner.start(
          {
            facingMode: "environment",
          },
          {
            fps: 10,
            qrbox: 250,
          },
          (decodedText) => {
            console.log(
              "QR SUCCESS:",
              decodedText
            );

            onScanSuccess({
              token: decodedText,
            });

            scanner
              .stop()
              .catch(() => {});
          },
          () => {}
        );
      } catch (error) {
        console.error(
          "QR START ERROR:",
          error
        );
      }
    }

    startScanner();

    return () => {
      if (scanner) {
        scanner
          .stop()
          .catch(() => {});
      }
    };
  }, [onScanSuccess]);

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "20px",
        overflow: "hidden",
        background: "#fff",
      }}
    >
      <div
        id="reader"
        style={{
          width: "100%",
          minHeight: "350px",
        }}
      />
    </div>
  );
}