import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

import Map, {
  Marker,
  Popup,
} from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

export default function MapTab({ onOpenPartner }) {
  const [partners, setPartners] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocation();
    loadPartners();
  }, []);

  function getDistance(
    lat1,
    lon1,
    lat2,
    lon2
  ) {
    const R = 6371;

    const dLat =
      ((lat2 - lat1) * Math.PI) / 180;

    const dLon =
      ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
      2 *
      Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
      );

    return R * c;
  }

  function formatDistance(distance) {
    return distance < 1
      ? `${Math.round(distance * 1000)} м`
      : `${distance.toFixed(1)} км`;
  }

  function getLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        alert(
          "GPS ERROR: " +
            error.code +
            " " +
            error.message
        );

        console.error(error);
      },
      {
        enableHighAccuracy: true,
      }
    );
  }

  async function loadPartners() {
    try {
      const { data, error } =
        await supabase
          .from("partners")
          .select("*")
          .eq("is_active", true)
          .in("status", [
            "approved",
            "active",
          ])
          .not("latitude", "is", null)
          .not("longitude", "is", null);

      if (error) throw error;

      setPartners(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 20 }}>
        Загрузка карты...
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div style={{ padding: 20 }}>
        Разрешите доступ к геолокации
      </div>
    );
  }

  const partnersWithDistance = partners
    .map((partner) => ({
      ...partner,
      distance: getDistance(
        userLocation.lat,
        userLocation.lng,
        Number(partner.latitude),
        Number(partner.longitude)
      ),
    }))
    .sort(
      (a, b) =>
        a.distance - b.distance
    );

  return (
    <div style={{ padding: 12 }}>
      <div
        style={{
          background:
            "linear-gradient(135deg,#14B8A6,#0F766E)",
          color: "#fff",
          padding: 16,
          borderRadius: 20,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          📍 Карта партнёров
        </div>

        <div>
          Найдено партнёров:
          {" "}
          {partners.length}
        </div>
      </div>

      <div
        style={{
          height: "70vh",
          borderRadius: 20,
          overflow: "hidden",
        }}
      >
        <Map
          initialViewState={{
            longitude: userLocation.lng,
            latitude: userLocation.lat,
            zoom: 14,
          }}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
        >
          <Marker
            longitude={userLocation.lng}
            latitude={userLocation.lat}
          >
            <div style={{ fontSize: 28 }}>
              🔵
            </div>
          </Marker>

          {partnersWithDistance.map(
            (partner) => (
              <Marker
                key={partner.id}
                longitude={Number(
                  partner.longitude
                )}
                latitude={Number(
                  partner.latitude
                )}
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  setSelectedPartner(
                    partner
                  );
                }}
              >
                <div
                  style={{
                    fontSize: 30,
                    cursor: "pointer",
                  }}
                >
                  🟢
                </div>
              </Marker>
            )
          )}

          {selectedPartner && (
            <Popup
              longitude={Number(
                selectedPartner.longitude
              )}
              latitude={Number(
                selectedPartner.latitude
              )}
              anchor="bottom"
              onClose={() =>
                setSelectedPartner(null)
              }
            >
              <div
                style={{
                  minWidth: 220,
                }}
              >
                <strong>
                  {
                    selectedPartner.business_name
                  }
                </strong>

                <div>
                  {
                    selectedPartner.category
                  }
                </div>

                <div>
                  Скидка:
                  {" "}
                  {selectedPartner.discount_percent ||
                    0}
                  %
                </div>

                <div>
                  📍 Расстояние:
                  {" "}
                  {formatDistance(
                    selectedPartner.distance
                  )}
                </div>

                <button
                  onClick={() =>
                    onOpenPartner?.(
                      selectedPartner
                    )
                  }
                  style={{
                    marginTop: 10,
                    border: "none",
                    padding: 10,
                    borderRadius: 10,
                    background:
                      "#14B8A6",
                    color: "#fff",
                    cursor: "pointer",
                    width: "100%",
                  }}
                >
                  Подробнее
                </button>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      <div
        style={{
          marginTop: 16,
          background: "#fff",
          borderRadius: 20,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          📍 Ближайшие партнёры
        </div>

        {partnersWithDistance
          .slice(0, 10)
          .map((partner) => (
            <div
              key={partner.id}
              onClick={() =>
                onOpenPartner?.(
                  partner
                )
              }
              style={{
                padding: 12,
                borderBottom:
                  "1px solid #eee",
                cursor: "pointer",
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                }}
              >
                {
                  partner.business_name
                }
              </div>

              <div
                style={{
                  color: "#666",
                  fontSize: 14,
                }}
              >
                {formatDistance(
                  partner.distance
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}