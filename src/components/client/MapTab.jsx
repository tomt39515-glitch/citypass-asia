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
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLocation();
    loadPartners();
  }, []);

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  function formatDistance(distance) {
    return distance < 1
      ? `${Math.round(distance * 1000)} м`
      : `${distance.toFixed(1)} км`;
  }

  function getMarker(category) {
    switch (category) {
      case "Кафе":
        return "🟤";
      case "Ресторан":
        return "🔴";
      case "SPA":
        return "🟣";
      case "Отель":
        return "🔵";
      case "Транспорт":
        return "🟠";
      default:
        return "🟢";
    }
  }

  function getCategoryIcon(category) {
    switch (category) {
      case "Кафе":
        return "☕";
      case "Ресторан":
        return "🍽️";
      case "SPA":
        return "💆";
      case "Отель":
        return "🏨";
      case "Транспорт":
        return "🚕";
      default:
        return "📍";
    }
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
      },
      { enableHighAccuracy: true }
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

      const { data: ratings } = await supabase
        .from("partner_ratings")
        .select("*");

      const ratingsMap = {};

      (ratings || []).forEach((r) => {
        ratingsMap[r.partner_id] = r;
      });

      const partnersWithRatings = (data || []).map((partner) => ({
        ...partner,
        rating: ratingsMap[partner.id]?.rating || 0,
        reviews_count:
          ratingsMap[partner.id]?.reviews_count || 0,
      }));

      setPartners(partnersWithRatings);
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
    .sort((a, b) => a.distance - b.distance);

  const categories = [
    "Все",
    ...new Set(
      partnersWithDistance
        .map((p) => p.category)
        .filter(Boolean)
    ),
  ];

  const filteredPartners =
    partnersWithDistance.filter(
      (partner) => {
        const categoryMatch =
          selectedCategory === "Все" ||
          partner.category === selectedCategory;

        const searchMatch =
          !search ||
          partner.business_name
            ?.toLowerCase()
            .includes(search.toLowerCase()) ||
          partner.category
            ?.toLowerCase()
            .includes(search.toLowerCase());

        return categoryMatch && searchMatch;
      }
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
          Найдено партнёров: {filteredPartners.length}
        </div>
      </div>

      <div
        style={{
          marginBottom: 12,
        }}
      >
        <input
          type="text"
          placeholder="🔍 Поиск партнёров..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 14,
            border: "1px solid #ddd",
            fontSize: 16,
            boxSizing: "border-box",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          marginBottom: 12,
          paddingBottom: 4,
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() =>
              setSelectedCategory(category)
            }
            style={{
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              borderRadius: 999,
              padding: "10px 14px",
              fontWeight: 600,
              background:
                selectedCategory === category
                  ? "#14B8A6"
                  : "#ffffff",
              color:
                selectedCategory === category
                  ? "#fff"
                  : "#111",
            }}
          >
            {category === "Все"
              ? "Все"
              : `${getCategoryIcon(category)} ${category}`}
          </button>
        ))}
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

          {filteredPartners.map((partner) => (
            <Marker
              key={partner.id}
              longitude={Number(partner.longitude)}
              latitude={Number(partner.latitude)}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedPartner(partner);
              }}
            >
              <div
                style={{
                  fontSize: 30,
                  cursor: "pointer",
                }}
              >
                {getMarker(partner.category)}
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

                <div>{selectedPartner.category}</div>

                <div
                  style={{
                    marginTop: 4,
                    marginBottom: 4,
                    color: "#F59E0B",
                    fontWeight: 700,
                  }}
                >
                  ⭐ {selectedPartner.rating || 0} ({selectedPartner.reviews_count || 0})
                </div>

                <div>
                  Скидка:{" "}
                  {selectedPartner.discount_percent || 0}%
                </div>

                <div>
                  📍{" "}
                  {formatDistance(
                    selectedPartner.distance
                  )}
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
            marginBottom: 16,
          }}
        >
          📍 Ближайшие партнёры
        </div>

        {filteredPartners.slice(0, 10).map((partner) => (
          <div
            key={partner.id}
            onClick={() =>
              onOpenPartner?.(partner)
            }
            style={{
              background: "#fff",
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 18,
              cursor: "pointer",
              boxShadow:
                "0 4px 12px rgba(0,0,0,0.08)",
              border:
                "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                height: 180,
                background: partner.image_url
                  ? `url(${partner.image_url}) center center / cover`
                  : "linear-gradient(135deg,#14B8A6,#0F766E)",
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  right: 12,
                  background: "#14B8A6",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: 999,
                  fontWeight: 700,
                }}
              >
                🎁 {partner.discount_percent || 0}%
              </div>
            </div>

            <div style={{ padding: 16 }}>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                {partner.business_name}
              </div>

              <div
                style={{
                  color: "#F59E0B",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                ⭐ {partner.rating || 0} ({partner.reviews_count || 0})
              </div>

              <div
                style={{
                  color: "#6B7280",
                  marginBottom: 10,
                }}
              >
                {getCategoryIcon(partner.category)}{" "}
                {partner.category}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                }}
              >
                <div
                  style={{
                    color: "#14B8A6",
                    fontWeight: 600,
                  }}
                >
                  📍 {formatDistance(partner.distance)}
                </div>

                <div
                  style={{
                    color: "#14B8A6",
                    fontWeight: 700,
                  }}
                >
                  Подробнее →
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
