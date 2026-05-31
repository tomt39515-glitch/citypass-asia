import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({
  onScanSuccess,
}) {
  const scannedRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner
      .start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: 250,
        },
        async (decodedText) => {
          if (scannedRef.current) return;

          scannedRef.current = true;

          onScanSuccess({
            token: decodedText,
          });

          try {
            await scanner.stop();
          } catch (e) {
            console.log(e);
          }
        },
        () => {}
      )
      .catch(console.error);

    return () => {
      try {
        scanner.stop();
      } catch (e) {}
    };
  }, []);

  return (
    <div
      id="reader"
      style={{
        width: "100%",
        minHeight: "350px",
      }}
    />
  );
}