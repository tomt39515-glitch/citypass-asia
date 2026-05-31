export default function OffersTab() {
  const partners = [
    {
      name: "Burger House",
      category: "Ресторан",
      discount: "10%",
      address: "Нячанг",
    },
    {
      name: "Ocean SPA",
      category: "СПА",
      discount: "15%",
      address: "Нячанг",
    },
    {
      name: "Seaside Hotel",
      category: "Отель",
      discount: "12%",
      address: "Нячанг",
    },
    {
      name: "City Coffee",
      category: "Кафе",
      discount: "7%",
      address: "Нячанг",
    },
  ];

  return (
    <div
      style={{
        maxWidth: "560px",
        margin: "0 auto",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#14B8A6,#0F766E)",
          borderRadius: "28px",
          padding: "24px",
          color: "#fff",
        }}
      >
        <div
          style={{
            opacity: 0.9,
          }}
        >
          Партнёры CityPass Asia
        </div>

        <div
          style={{
            fontSize: "34px",
            fontWeight: 800,
            marginTop: "10px",
          }}
        >
          127
        </div>

        <div
          style={{
            marginTop: "8px",
            opacity: 0.85,
          }}
        >
          активных партнёров
        </div>
      </div>

      {/* SEARCH */}

      <input
        placeholder="Поиск партнёров..."
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "18px",
          border: "none",
          background: "#fff",
          fontSize: "15px",
          boxSizing: "border-box",
        }}
      />

      {/* LIST */}

      {partners.map((partner, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            borderRadius: "24px",
            padding: "18px",
            boxShadow:
              "0 5px 15px rgba(15,23,42,.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "18px",
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
                {partner.category}
              </div>
            </div>

            <div
              style={{
                background: "#ECFDF5",
                color: "#14B8A6",
                padding: "10px 14px",
                borderRadius: "999px",
                fontWeight: 700,
              }}
            >
              {partner.discount}
            </div>
          </div>

          <div
            style={{
              marginTop: "12px",
              color: "#64748B",
            }}
          >
            {partner.address}
          </div>

          <button
            style={{
              width: "100%",
              marginTop: "14px",
              border: "none",
              borderRadius: "16px",
              padding: "14px",
              background:
                "linear-gradient(135deg,#14B8A6,#0D9488)",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Подробнее
          </button>
        </div>
      ))}
    </div>
  );
}