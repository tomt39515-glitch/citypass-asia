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
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .eq("is_active", true)
        .in("status", ["approved", "active"])
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
    return <div style={{ padding: 20 }}>Загрузка карты...</div>;
  }

  if (!userLocation) {
    return (
      <div style={{ padding: 20 }}>
        Разрешите доступ к геолокации
      </div>
    );
  }

  return (
    <div style={{ padding: 12 }}>
      <div
        style={{
          background: "linear-gradient(135deg,#14B8A6,#0F766E)",
          color: "#fff",
          padding: 16,
          borderRadius: 20,
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 700 }}>
          📍 Карта партнёров
        </div>
        <div>Найдено партнёров: {partners.length}</div>
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
            <div style={{ fontSize: 28 }}>🔵</div>
          </Marker>

          {partners.map((partner) => (
            <Marker
              key={partner.id}
              longitude={Number(partner.longitude)}
              latitude={Number(partner.latitude)}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedPartner(partner);
              }}
            >
              <div style={{ fontSize: 30, cursor: "pointer" }}>
                🟢
              </div>
            </Marker>
          ))}

          {selectedPartner && (
            <Popup
              longitude={Number(selectedPartner.longitude)}
              latitude={Number(selectedPartner.latitude)}
              anchor="bottom"
              onClose={() => setSelectedPartner(null)}
            >
              <div style={{ minWidth: 220 }}>
                <strong>
                  {selectedPartner.business_name}
                </strong>

                <div>
                  {selectedPartner.category}
                </div>

                <div>
                  Скидка:{" "}
                  {selectedPartner.discount_percent || 0}%
                </div>

                <button
                  onClick={() =>
                    onOpenPartner?.(selectedPartner)
                  }
                  style={{
                    marginTop: 10,
                    border: "none",
                    padding: 10,
                    borderRadius: 10,
                    background: "#14B8A6",
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
    </div>
  );
}
