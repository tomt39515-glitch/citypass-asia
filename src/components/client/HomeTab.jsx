export default function HomeTab({ onChangeTab }) {
  const categories = [
    {
      title: "Рестораны",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    },
    {
      title: "Отели",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800",
    },
    {
      title: "Магазины",
      image:
        "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800",
    },
    {
      title: "Развлечения",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
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
          paddingBottom: "100px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {/* HERO */}

        <div
          style={{
            position: "relative",
            height: "240px",
            borderRadius: "28px",
            overflow: "hidden",
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.15))",
            }}
          />

          <div
            style={{
              position: "absolute",
              left: "20px",
              right: "20px",
              bottom: "20px",
              color: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                opacity: 0.9,
              }}
            >
              CITYPASS ASIA
            </div>

            <h1
              style={{
                margin: "8px 0",
                fontSize: "30px",
                lineHeight: 1.1,
              }}
            >
              Откройте Азию
              <br />
              с привилегиями
            </h1>

            <div
              style={{
                fontSize: "14px",
                opacity: 0.9,
              }}
            >
              Эксклюзивные предложения рядом с вами
            </div>
          </div>
        </div>

        {/* QR CARD */}

        <div
          onClick={() => onChangeTab?.("qr")}
          style={{
            background:
              "linear-gradient(135deg,#14B8A6,#0F766E)",
            borderRadius: "24px",
            padding: "22px",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              opacity: 0.9,
            }}
          >
            CITYPASS CLUB
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            Показать QR-код
          </div>

          <div
            style={{
              marginTop: "6px",
              opacity: 0.9,
            }}
          >
            Получайте привилегии у партнёров
          </div>
        </div>

        {/* CATEGORIES */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
          }}
        >
          {categories.map((item) => (
            <div
              key={item.title}
              style={{
                position: "relative",
                height: "120px",
                borderRadius: "20px",
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
                    "linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.1))",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: "14px",
                  bottom: "14px",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: "16px",
                }}
              >
                {item.title}
              </div>
            </div>
          ))}
        </div>

        {/* SAVINGS */}

        <div
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "20px",
            boxShadow:
              "0 8px 24px rgba(15,23,42,.06)",
          }}
        >
          <div
            style={{
              color: "#64748B",
            }}
          >
            Вы сэкономили
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "34px",
              fontWeight: 800,
              color: "#0F172A",
            }}
          >
            12 458 000 ₫
          </div>

          <div
            style={{
              marginTop: "4px",
              color: "#64748B",
            }}
          >
            за всё время
          </div>
        </div>

        {/* NEARBY */}

        <div>
          <h3
            style={{
              marginBottom: "12px",
              color: "#0F172A",
            }}
          >
            Рядом с вами
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {[
              {
                name: "Duck Cafe",
                rating: "4.8",
                distance: "180 м",
                discount: "-15%",
              },
              {
                name: "Sailing Club",
                rating: "4.9",
                distance: "350 м",
                discount: "-20%",
              },
            ].map((partner) => (
              <div
                key={partner.name}
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  padding: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow:
                    "0 6px 20px rgba(15,23,42,.05)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    {partner.name}
                  </div>

                  <div
                    style={{
                      marginTop: "4px",
                      color: "#64748B",
                    }}
                  >
                    ⭐ {partner.rating} · 📍 {partner.distance}
                  </div>
                </div>

                <div
                  style={{
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
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}