export default function HistoryTab() {
  const history = [
    {
      partner: "Burger House",
      date: "29 мая 2026",
      amount: "1 000 000 ₫",
      saved: "100 000 ₫",
      discount: "10%",
    },
    {
      partner: "Ocean SPA",
      date: "27 мая 2026",
      amount: "2 000 000 ₫",
      saved: "300 000 ₫",
      discount: "15%",
    },
    {
      partner: "Seaside Hotel",
      date: "24 мая 2026",
      amount: "3 500 000 ₫",
      saved: "350 000 ₫",
      discount: "10%",
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
          Всего сэкономлено
        </div>

        <div
          style={{
            fontSize: "34px",
            fontWeight: 800,
            marginTop: "10px",
          }}
        >
          750 000 ₫
        </div>

        <div
          style={{
            marginTop: "10px",
            opacity: 0.85,
          }}
        >
          3 использованные скидки
        </div>
      </div>

      {/* TITLE */}

      <h2
        style={{
          margin: 0,
          color: "#0F172A",
        }}
      >
        История операций
      </h2>

      {/* LIST */}

      {history.map((item, index) => (
        <div
          key={index}
          style={{
            background: "#fff",
            borderRadius: "22px",
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
                  fontSize: "16px",
                  color: "#0F172A",
                }}
              >
                {item.partner}
              </div>

              <div
                style={{
                  color: "#64748B",
                  marginTop: "4px",
                  fontSize: "13px",
                }}
              >
                {item.date}
              </div>
            </div>

            <div
              style={{
                background: "#ECFDF5",
                color: "#14B8A6",
                padding: "8px 12px",
                borderRadius: "999px",
                fontWeight: 700,
              }}
            >
              -{item.saved}
            </div>
          </div>

          <div
            style={{
              marginTop: "14px",
              display: "flex",
              justifyContent:
                "space-between",
            }}
          >
            <div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                }}
              >
                Сумма покупки
              </div>

              <div
                style={{
                  fontWeight: 600,
                }}
              >
                {item.amount}
              </div>
            </div>

            <div>
              <div
                style={{
                  color: "#64748B",
                  fontSize: "12px",
                }}
              >
                Скидка
              </div>

              <div
                style={{
                  fontWeight: 700,
                  color: "#14B8A6",
                }}
              >
                {item.discount}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}