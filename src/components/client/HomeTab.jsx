import heroImage from "../../assets/citypass-hero.png";
import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { Bell, MapPin, Utensils, Hotel, ShoppingBag, PartyPopper } from "lucide-react";

export default function HomeTab({ onChangeTab }) {
const userName =
  window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || "Гость";

const [partners, setPartners] = useState([]);
const [userLocation, setUserLocation] = useState(null);

useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      setUserLocation(location);
      loadPartners(location);
    },
    () => {
      loadPartners(null);
    }
  );
}, []);

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

async function loadPartners(location) {
  const { data } = await supabase
    .from("partners")
    .select("*")
    .eq("is_active", true)
    .in("status", ["approved", "active"]);

  if (!location) {
    setPartners(data || []);
    return;
  }

  const sortedPartners = (data || [])
    .filter((p) => p.latitude && p.longitude)
    .map((partner) => ({
      ...partner,
      distance: getDistance(
        location.lat,
        location.lng,
        Number(partner.latitude),
        Number(partner.longitude)
      ),
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 5);

  setPartners(sortedPartners);
}

  const categories = [
    { title: "Рестораны", count: "126 мест", icon: <Utensils size={20} />, image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200" },
    { title: "Отели", count: "42 объекта", icon: <Hotel size={20} />, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200" },
    { title: "Магазины", count: "78 мест", icon: <ShoppingBag size={20} />, image: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200" },
    { title: "Развлечения", count: "35 мест", icon: <PartyPopper size={20} />, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200" },
  ];

  return (
    <div style={{ background:"#f6f8fb", minHeight:"100vh", fontFamily:"Inter,system-ui,sans-serif" }}>
      <div style={{
  width:"100vw",
  paddingBottom:120
}}>
        <div style={{
          height:"60vh",
          minHeight:500,
          borderBottomLeftRadius:36,
          borderBottomRightRadius:36,
          overflow:"hidden",
          position:"relative",
          backgroundImage:`url(${heroImage})`,
          backgroundSize:"cover",
          backgroundPosition:"center"
        }}>
          <div style={{
            position:"absolute",
            inset:0,
            background:"linear-gradient(to top,rgba(0,0,0,.60),rgba(0,0,0,.05))"
          }} />

          <div
            style={{
              position: "absolute",
              top: 30,
              left: 24,
              right: 24,
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div style={{ color: "#fff" }}>
                <div style={{ fontSize: 28, fontWeight: 800 }}>
                  CityPass Asia ✨
                </div>
                <div style={{ marginTop: 8, fontSize: 16 }}>
                  Клуб привилегий в Азии
                </div>
              </div>

              <div
                style={{
                  background: "#EBC75A",
                  color: "#111",
                  padding: "8px 16px",
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                GOLD CLUB
              </div>
            </div>

            <div style={{ marginTop: 40, color: "#fff" }}>
              <div style={{ fontSize: 24 }}>
                Добро пожаловать,
              </div>

              <div
                style={{
                  fontSize: 64,
                  fontWeight: 800,
                  lineHeight: 1,
                  marginTop: 8,
                }}
              >
                {userName} 👋
              </div>
            </div>

            <div
              style={{
                marginTop: 32,
                width: 340,
                backdropFilter: "blur(14px)",
                background: "rgba(255,255,255,.18)",
                borderRadius: 28,
                padding: 24,
                color: "#fff",
              }}
            >
              <div style={{ fontSize: 16 }}>
                Ваша выгода
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 44,
                  fontWeight: 800,
                }}
              >
                0 ₫
              </div>

              <div style={{ marginTop: 10 }}>
                За всё время поездок с нами
              </div>
            </div>
          </div>
        </div>

      <div
  onClick={() => onChangeTab?.("map")}
  style={{
    marginTop: -60,
    marginLeft: 16,
    marginRight: 16,
    position: "relative",
    background: "linear-gradient(135deg,#0e8f8f,#06656c)",
    color: "#fff",
    borderRadius: 28,
    padding: 24,
    display: "flex",
    alignItems: "center",
    gap: 18,
    boxShadow: "0 10px 30px rgba(0,0,0,.15)",
    cursor: "pointer",
  }}
>
  <div
    style={{
      background: "#fff",
      width: 72,
      height: 72,
      borderRadius: 18,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#06656c",
    }}
  >
    <MapPin size={42} />
  </div>

  <div>
    <div style={{ fontSize: 20, fontWeight: 800 }}>
      Открыть карту привилегий
    </div>
  </div>
</div>




<div
  style={{
    margin: "20px 16px 0",
  }}
>
  <div
    style={{
      fontSize: 22,
      fontWeight: 800,
      marginBottom: 14,
      color: "#0F172A",
    }}
  >
    Ближайшие предложения
  </div>

  <div
    style={{
      display: "flex",
      gap: 12,
      overflowX: "auto",
      paddingBottom: 10,
    }}
  >
    {partners.map((partner) => (
      <div
        key={partner.id}
        style={{
          minWidth:220,
          background:"#fff",
          borderRadius:20,
          overflow:"hidden",
          boxShadow:"0 4px 15px rgba(0,0,0,.08)"
        }}
      >
        {partner.cover_photo_url && (
          <img
            src={partner.cover_photo_url}
            alt={partner.business_name}
            style={{
              width:"100%",
              height:120,
              objectFit:"cover"
            }}
          />
        )}

        <div style={{padding:16}}>
          <div style={{fontWeight:700}}>
            {partner.business_name}
          </div>

          <div style={{marginTop:6,color:"#64748B"}}>
            {partner.category}
          </div>

          <div style={{ marginTop: 8, color: "#14B8A6", fontWeight: 600 }}>
            📍 {
              partner.distance < 1
                ? `${Math.round(partner.distance * 1000)} м`
                : `${partner.distance.toFixed(1)} км`
            }
          </div>

          <div style={{marginTop:6}}>
            🕒 {partner.working_hours || "Не указано"}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

<div
  onClick={() => onChangeTab?.("special-offers")}
  style={{
    margin: "20px 16px 40px",
    cursor: "pointer",
  }}
>
  <div
    style={{
      fontSize: 22,
      fontWeight: 800,
      marginBottom: 14,
      color: "#0F172A",
    }}
  >
    Специальные предложения
  </div>

  <div
    style={{
      borderRadius: 24,
      overflow: "hidden",
      minHeight: 180,
      backgroundImage:
        "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      position: "relative",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background:
          "linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.1))",
      }}
    />

    <div
      style={{
        position: "absolute",
        left: 20,
        bottom: 20,
        color: "#fff",
      }}
    >
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
        }}
      >
        CityPass Asia
      </div>

      <div
        style={{
          marginTop: 6,
          opacity: 0.95,
        }}
      >
        Лучшие предложения для участников клуба
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}