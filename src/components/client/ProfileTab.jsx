export default function ProfileTab({
  role,
  setRole,
}) {
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
      {/* CARD */}

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
            fontSize: "14px",
            opacity: 0.9,
          }}
        >
          CITYPASS ASIA
        </div>

        <div
          style={{
            marginTop: "12px",
            fontSize: "28px",
            fontWeight: 800,
          }}
        >
          Участник клуба
        </div>

        <div
          style={{
            marginTop: "12px",
            display: "inline-block",
            background:
              "rgba(255,255,255,.18)",
            padding: "8px 14px",
            borderRadius: "999px",
          }}
        >
          Активный статус
        </div>

        <div
          style={{
            marginTop: "24px",
            opacity: 0.9,
          }}
        >
          ID: CPA-000001
        </div>
      </div>

      {/* STATS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Экономия
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "24px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            750 000 ₫
          </div>
        </div>

        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              color: "#64748B",
              fontSize: "14px",
            }}
          >
            Скидок
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "24px",
              fontWeight: 700,
              color: "#14B8A6",
            }}
          >
            341
          </div>
        </div>
      </div>

      {/* MENU */}

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          overflow: "hidden",
        }}
      >
        {[
          "Мои данные",
          "Мои скидки",
          "Избранные партнёры",
          "Уведомления",
          "Поддержка",
          "О CityPass Asia",
        ].map((item, index, array) => (
          <div
            key={item}
            style={{
              padding: "18px 20px",
              borderBottom:
                index !== array.length - 1
                  ? "1px solid #F1F5F9"
                  : "none",
              cursor: "pointer",
              color: "#0F172A",
              fontWeight: 500,
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* ROLES */}

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "20px",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            marginBottom: "14px",
            color: "#0F172A",
          }}
        >
          Мои роли
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          {[
            {
              key: "client",
              label: "Клиент",
            },
            {
              key: "partner",
              label: "Партнёр",
            },
            {
              key: "agent",
              label: "Агент",
            },
            {
              key: "admin",
              label: "Администратор",
            },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setRole(item.key)}
              style={{
                border: "none",
                borderRadius: "16px",
                padding: "14px",
                cursor: "pointer",
                fontWeight: 600,
                background:
                  role === item.key
                    ? "#14B8A6"
                    : "#F1F5F9",
                color:
                  role === item.key
                    ? "#FFFFFF"
                    : "#0F172A",
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: "16px",
            padding: "14px",
            background: "#F8FAFC",
            borderRadius: "16px",
            color: "#64748B",
            fontSize: "13px",
            textAlign: "center",
          }}
        >
          Владелец CityPass Asia
        </div>
      </div>

      {/* SUPPORT */}

      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "20px",
        }}
      >
        <div
          style={{
            fontWeight: 700,
            marginBottom: "10px",
          }}
        >
          Поддержка CityPass
        </div>

        <div
          style={{
            color: "#64748B",
          }}
        >
          support@citypass.asia
        </div>
      </div>
    </div>
  );
}