export default function HomeTab({ onChangeTab }) {
  const categories = [
    {
      title: "Рестораны",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
    },
    {
      title: "Отели",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    },
    {
      title: "Магазины",
      image:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1200",
    },
    {
      title: "Развлечения",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200",
    },
  ];

  const nearbyPartners = [
    {
      name: "Duck Cafe",
      rating: "4.8",
      distance: "180 м",
      discount: "-15%",
      image:
        "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1200",
    },
    {
      name: "Sailing Club",
      rating: "4.9",
      distance: "350 м",
      discount: "-20%",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200",
    },
    {
      name: "Sunrise Hotel",
      rating: "4.7",
      distance: "500 м",
      discount: "-10%",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200",
    },
  ];

  return (
    <div
      style={{
        background: "#F7FAFB",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          maxWidth: "480px",
          margin: "0 auto",
          padding: "16px",
          paddingBottom: "120px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {/* HERO */}

        <div
          style={{
            position: "relative",
            height: "340px",
            borderRadius: "30px",
            overflow: "hidden",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=2000')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow:
              "0 12px 30px rgba(15,23,42,.15)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,.70), rgba(0,0,0,.15))",
            }}
          />

          {/* TOP BAR */}

          <div
            style={{
              position: "absolute",
              top: "18px",
              left: "18px",
              right: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: "24px",
                }}
              >
                CityPass Asia
              </div>

              <div
                style={{
                  color: "rgba(255,255,255,.85)",
                  fontSize: "13px",
                }}
              >
                Клуб привилегий
              </div>
            </div>

            <div
              style={{
                background: "#D4AF37",
                color: "#0F172A",
                padding: "10px 18px",
                borderRadius: "999px",
                fontWeight: 700,
                fontSize: "14px",
              }}
            >
              CLUB
            </div>
          </div>

          {/* TEXT */}

          <div
            style={{
              position: "absolute",
              left: "22px",
              right: "22px",
              bottom: "24px",
              color: "#fff",
            }}
          >
            <h1
              style={{
                margin: 0,
                fontSize: "42px",
                lineHeight: 1.05,
                fontWeight: 800,
              }}
            >
              Откройте Азию
              <br />
              с привилегиями
            </h1>

            <div
              style={{
                marginTop: "14px",
                fontSize: "15px",
                lineHeight: 1.4,
                maxWidth: "300px",
                opacity: 0.95,
              }}
            >
              Рестораны, отели, магазины и сервисы
              с эксклюзивными предложениями рядом с вами.
            </div>
          </div>
        </div>

        {/* QR CARD */}

        <div
          onClick={() => onChangeTab?.("qr")}
          style={{
            background:
              "linear-gradient(135deg,#14B8A6,#0F766E)",
            borderRadius: "26px",
            padding: "26px",
            color: "#fff",
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow:
              "0 10px 25px rgba(20,184,166,.25)",
          }}
        >
          <div>
            <div
              style={{
                opacity: 0.9,
                fontSize: "13px",
              }}
            >
              CITYPASS CLUB
            </div>

            <div
              style={{
                marginTop: "8px",
                fontSize: "26px",
                fontWeight: 800,
              }}
            >
              Показать QR-код
            </div>

            <div
              style={{
                marginTop: "6px",
                opacity: 0.9,
                fontSize: "14px",
              }}
            >
              Получайте привилегии у партнёров
            </div>
          </div>

          <div
            style={{
              fontSize: "42px",
            }}
          >
            ⬜
          </div>
        </div>

        {/* CATEGORIES */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
          }}
        >
          {categories.map((item) => (
            <div
              key={item.title}
              style={{
                position: "relative",
                height: "170px",
                borderRadius: "22px",
                overflow: "hidden",
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,.75), rgba(0,0,0,.10))",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: "14px",
                  bottom: "14px",
                  color: "#fff",
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: "18px",
                  }}
                >
                  {item.title}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SAVINGS */}

        <div
          style={{
            background:
              "linear-gradient(135deg,#14B8A6,#0F766E)",
            borderRadius: "26px",
            padding: "24px",
            color: "#fff",
          }}
        >
          <div
            style={{
              opacity: 0.9,
              fontSize: "14px",
            }}
          >
            Вы сэкономили
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "38px",
              fontWeight: 800,
            }}
          >
            12 458 000 ₫
          </div>

          <div
            style={{
              marginTop: "6px",
              opacity: 0.9,
            }}
          >
            за всё время
          </div>
        </div>

        {/* NEARBY */}

        <div>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 800,
              color: "#0F172A",
              marginBottom: "14px",
            }}
          >
            Рядом с вами
          </div>

          <div
            style={{
              display: "flex",
              gap: "14px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {nearbyPartners.map((partner) => (
              <div
                key={partner.name}
                style={{
                  minWidth: "240px",
                  background: "#fff",
                  borderRadius: "22px",
                  overflow: "hidden",
                  boxShadow:
                    "0 8px 24px rgba(15,23,42,.08)",
                }}
              >
                <div
                  style={{
                    height: "140px",
                    backgroundImage: `url(${partner.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <div
                  style={{
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "17px",
                    }}
                  >
                    {partner.name}
                  </div>

                  <div
                    style={{
                      marginTop: "6px",
                      color: "#64748B",
                      fontSize: "14px",
                    }}
                  >
                    ⭐ {partner.rating} · 📍 {partner.distance}
                  </div>

                  <div
                    style={{
                      marginTop: "10px",
                      display: "inline-block",
                      background: "#14B8A6",
                      color: "#fff",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      fontWeight: 700,
                    }}
                  >
                    {partner.discount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}