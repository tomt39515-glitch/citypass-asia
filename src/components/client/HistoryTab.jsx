export default function HistoryTab() {
  const history = [
    {
      name: "Burger House",
      discount: "120 000 ₫",
      date: "Сегодня • 14:25",
      icon: "🍔",
    },
    {
      name: "Ocean SPA",
      discount: "200 000 ₫",
      date: "Сегодня • 11:10",
      icon: "💆",
    },
    {
      name: "Seaside Hotel",
      discount: "350 000 ₫",
      date: "Вчера • 19:45",
      icon: "🏨",
    },
    {
      name: "Coffee Time",
      discount: "80 000 ₫",
      date: "Вчера • 10:20",
      icon: "☕",
    },
  ];

  return (
    <div
      style={{
        padding: "16px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          marginBottom: "20px",
        }}
      >
        История
      </h1>

      <div
        style={{
          background:
            "linear-gradient(135deg,#16a34a,#22c55e)",
          borderRadius: "24px",
          padding: "24px",
          color: "#fff",
          marginBottom: "20px",
        }}
      >
        <div>Всего сэкономлено</div>

        <h2
          style={{
            marginTop: "10px",
            fontSize: "32px",
          }}
        >
          12 458 000 ₫
        </h2>

        <div
          style={{
            opacity: 0.9,
          }}
        >
          за всё время использования
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {history.map((item, index) => (
          <div
            key={index}
            style={{
              background: "#fff",
              borderRadius: "20px",
              padding: "18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow:
                "0 5px 20px rgba(0,0,0,.05)",
            }}
          >
            <div
              style={{
                display: "flex",
                gap: "15px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  fontSize: "28px",
                }}
              >
                {item.icon}
              </div>

              <div>
                <div
                  style={{
                    fontWeight: "600",
                  }}
                >
                  {item.name}
                </div>

                <div
                  style={{
                    color: "#777",
                    fontSize: "14px",
                  }}
                >
                  {item.date}
                </div>
              </div>
            </div>

            <div
              style={{
                color: "#16a34a",
                fontWeight: "700",
              }}
            >
              +{item.discount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}