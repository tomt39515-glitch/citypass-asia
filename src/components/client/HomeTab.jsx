export default function HomeTab() {
  const categories = [
    "🍔 Рестораны",
    "🏨 Отели",
    "🏥 Медицина",
    "💆 SPA",
    "🚕 Такси",
    "🛍 Магазины",
    "🏝 Экскурсии",
    "🛵 Байки",
  ];

  const offers = [
    {
      name: "Burger House",
      discount: "15%",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    },
    {
      name: "Ocean SPA",
      discount: "20%",
      image:
        "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800",
    },
    {
      name: "Coffee Time",
      discount: "10%",
      image:
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800",
    },
  ];

  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f7fb",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              color: "#ff7b00",
              fontSize: "32px",
            }}
          >
            CityPass Asia
          </h1>

          <div
            style={{
              color: "#666",
              marginTop: "4px",
            }}
          >
            Добро пожаловать 👋
          </div>
        </div>

        <div style={{ fontSize: "32px" }}>🔔</div>
      </div>

      {/* Banner */}
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1528127269322-539801943592?w=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          borderRadius: "24px",
          padding: "24px",
          minHeight: "220px",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.35))",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ fontSize: "18px" }}>
            Доброе утро, Виталий ☀️
          </div>

          <h2
            style={{
              marginTop: "10px",
              fontSize: "34px",
              lineHeight: 1.1,
            }}
          >
            Выгодные предложения
            <br />
            во Вьетнаме
          </h2>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            style={{
              background: "#fff",
              color: "#000",
              padding: "12px 16px",
              borderRadius: "16px",
            }}
          >
            🏪 127 партнёров
          </div>

          <div
            style={{
              background: "#fff",
              color: "#000",
              padding: "12px 16px",
              borderRadius: "16px",
            }}
          >
            🎁 До 50% скидок
          </div>
        </div>
      </div>

      {/* Search */}
      <input
        placeholder="Поиск ресторанов, отелей, услуг..."
        style={{
          width: "100%",
          padding: "18px",
          borderRadius: "18px",
          border: "none",
          fontSize: "16px",
          boxSizing: "border-box",
          boxShadow: "0 5px 15px rgba(0,0,0,.05)",
        }}
      />

      {/* Categories */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        {categories.map((item) => (
          <div
            key={item}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "24px",
              textAlign: "center",
              boxShadow: "0 5px 20px rgba(0,0,0,.05)",
              fontWeight: "600",
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Savings */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#ffb800,#ff7b00)",
          borderRadius: "24px",
          padding: "24px",
          color: "#fff",
        }}
      >
        <div>Сегодня пользователи сэкономили</div>

        <h2
          style={{
            marginTop: "10px",
            marginBottom: 0,
          }}
        >
          12 458 000 ₫
        </h2>
      </div>

      {/* Popular */}
      <div>
        <h2>Популярное рядом</h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            paddingBottom: "10px",
          }}
        >
          {offers.map((item) => (
            <div
              key={item.name}
              style={{
                minWidth: "240px",
                background: "#fff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,.05)",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                }}
              />

              <div
                style={{
                  padding: "16px",
                }}
              >
                <h3>{item.name}</h3>

                <div
                  style={{
                    color: "#ff7b00",
                    fontWeight: "700",
                  }}
                >
                  Скидка {item.discount}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}