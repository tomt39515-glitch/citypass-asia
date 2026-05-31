import React, { useEffect } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({
  onScanSuccess,
}) {
  useEffect(() => {
    const scanner = new Html5Qrcode("reader");

    scanner
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250,
        },
        (decodedText) => {
          onScanSuccess({
            token: decodedText,
          });

          // НИЧЕГО НЕ ОСТАНАВЛИВАЕМ
        },
        () => {}
      )
      .catch(console.error);

    return () => {};
  }, []);

  return (
    <div id="reader" />
  );
}