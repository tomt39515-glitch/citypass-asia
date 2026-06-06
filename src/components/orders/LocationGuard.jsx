import React, {
  useEffect,
  useState,
} from "react";

function getDistanceMeters(
  lat1,
  lon1,
  lat2,
  lon2
) {
  const R = 6371000;

  const dLat =
    ((lat2 - lat1) * Math.PI) /
    180;

  const dLon =
    ((lon2 - lon1) * Math.PI) /
    180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos(
      (lat1 * Math.PI) / 180
    ) *
      Math.cos(
        (lat2 * Math.PI) / 180
      ) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return Math.round(R * c);
}

export default function LocationGuard({
  partner,
  maxDistance = 50,
  onAccessChange,
}) {
  const [distance, setDistance] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    checkLocation();
  }, [partner]);

  function checkLocation() {
    if (
      !partner?.latitude ||
      !partner?.longitude
    ) {
      setLoading(false);

      if (onAccessChange) {
        onAccessChange(true);
      }

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const meters =
          getDistanceMeters(
            position.coords.latitude,
            position.coords.longitude,
            Number(
              partner.latitude
            ),
            Number(
              partner.longitude
            )
          );

        setDistance(meters);

        if (onAccessChange) {
          onAccessChange(
            meters <= maxDistance
          );
        }

        setLoading(false);
      },
      () => {
        setLoading(false);

        if (onAccessChange) {
          onAccessChange(false);
        }
      }
    );
  }

  if (loading) {
    return (
      <div
        style={{
          padding: 12,
          marginTop: 12,
          borderRadius: 12,
          background: "#f3f4f6",
        }}
      >
        📍 Определяем местоположение...
      </div>
    );
  }

  if (distance === null) {
    return null;
  }

  const allowed =
    distance <= maxDistance;

  return (
    <div
      style={{
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        background: allowed
          ? "#dcfce7"
          : "#fee2e2",
      }}
    >
      <div>
        📍 До заведения:
        {" "}
        {distance}
        {" "}
        м
      </div>

      {allowed ? (
        <div
          style={{
            color: "#166534",
            fontWeight: 600,
            marginTop: 6,
          }}
        >
          ✅ Можно заказать
        </div>
      ) : (
        <div
          style={{
            color: "#b91c1c",
            fontWeight: 600,
            marginTop: 6,
          }}
        >
          ❌ Подойдите ближе
          (до {maxDistance} м)
        </div>
      )}
    </div>
  );
}