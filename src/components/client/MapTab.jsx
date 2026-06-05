import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapTab({
  onOpenPartner,
}) {
  const [partners, setPartners] =
    useState([]);

  const [userLocation, setUserLocation] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

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
      <div
        style={{
          padding: 20,
        }}
      >
        Загрузка карты...
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div
        style={{
          padding: 20,
        }}
      >
        Разрешите доступ к геолокации
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 12,
      }}
    >
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

      <MapContainer
        center={[
          userLocation.lat,
          userLocation.lng,
        ]}
        zoom={14}
        style={{
          height: "70vh",
          width: "100%",
          borderRadius: 20,
        }}
      >
        <TileLayer
          attribution="OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[
            userLocation.lat,
            userLocation.lng,
          ]}
        >
          <Popup>
            📍 Вы здесь
          </Popup>
        </Marker>

        {partners.map((partner) => (
          <Marker
            key={partner.id}
            position={[
              Number(partner.latitude),
              Number(partner.longitude),
            ]}
          >
            <Popup>
              <div>
                <strong>
                  {partner.business_name}
                </strong>

                <div>
                  {partner.category}
                </div>

                <div>
                  Скидка:
                  {" "}
                  {partner.discount_percent || 0}
                  %
                </div>

                <button
                  onClick={() =>
                    onOpenPartner?.(
                      partner
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
                  }}
                >
                  Подробнее
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}