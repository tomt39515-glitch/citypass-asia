import React from "react";
import {
  Home,
  QrCode,
  History,
  User,
  LayoutDashboard,
  ScanLine,
  Wallet,
  BarChart3,
  Shield,
  Users,
  CreditCard,
  Briefcase,
} from "lucide-react";

export default function AppLayout({
  role,
  currentTab,
  onChangeTab,
  children,
}) {
  const tabsByRole = {
    client: [
      { key: "home", label: "Главная", icon: Home },
      { key: "offers", label: "Партнёры", icon: Briefcase },
      { key: "qr", label: "Карта", icon: QrCode },
      { key: "history", label: "История", icon: History },
      { key: "profile", label: "Профиль", icon: User },
    ],

    partner: [
      { key: "dashboard", label: "Главная", icon: LayoutDashboard },
      { key: "scanner", label: "QR", icon: ScanLine },
      { key: "transactions", label: "История", icon: History },
      { key: "balance", label: "Баланс", icon: Wallet },
      { key: "analytics", label: "Отчёты", icon: BarChart3 },
    ],

    admin: [
      { key: "dashboard", label: "Панель", icon: Shield },
      { key: "partners", label: "Партнёры", icon: Briefcase },
      { key: "clients", label: "Клиенты", icon: Users },
      { key: "topups", label: "Баланс", icon: Wallet },
      { key: "transactions", label: "Операции", icon: CreditCard },
    ],

    agent: [
      { key: "dashboard", label: "Главная", icon: LayoutDashboard },
      { key: "partners", label: "Партнёры", icon: Briefcase },
      { key: "earnings", label: "Доход", icon: Wallet },
    ],
  };

  const tabs = tabsByRole[role] || [];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F4F7FB",
      }}
    >
      {/* HEADER */}

      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "#FFFFFF",
          padding: "16px 20px",
          borderBottom: "1px solid #E2E8F0",
        }}
      >
        <div
          style={{
            maxWidth: "560px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 800,
                color: "#14B8A6",
              }}
            >
              CityPass Asia
            </div>

            <div
              style={{
                fontSize: "12px",
                color: "#64748B",
              }}
            >
              Клуб привилегий
            </div>
          </div>

          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,#14B8A6,#0F766E)",
            }}
          />
        </div>
      </header>

      {/* CONTENT */}

      <main
        style={{
          paddingBottom: "110px",
        }}
      >
        {children}
      </main>

      {/* BOTTOM MENU */}

      <nav
        style={{
          position: "fixed",
          bottom: "12px",
          left: "12px",
          right: "12px",
          maxWidth: "560px",
          margin: "0 auto",
          background: "#FFFFFF",
          borderRadius: "28px",
          padding: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow:
            "0 10px 35px rgba(15,23,42,.12)",
          zIndex: 1000,
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              style={{
                flex: 1,
                border: "none",
                background: active
                  ? "linear-gradient(135deg,#14B8A6,#0D9488)"
                  : "transparent",
                color: active
                  ? "#FFFFFF"
                  : "#64748B",
                borderRadius: "18px",
                padding: "10px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                transition: "all .2s ease",
              }}
            >
              <Icon size={22} />

              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}