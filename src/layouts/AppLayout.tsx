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
  Bell,
  ShoppingBag,
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
      { key: "map", label: "Карта", icon: QrCode },
      { key: "history", label: "История", icon: History },
      { key: "profile", label: "Профиль", icon: User },
    ],

    partner: [
      {
        key: "home",
        label: "Главная",
        icon: LayoutDashboard,
      },
      {
        key: "scanner",
        label: "QR",
        icon: ScanLine,
      },
      {
        key: "transactions",
        label: "История",
        icon: History,
      },
      {
        key: "deposits",
        label: "Депозит",
        icon: Wallet,
      },
      {
        key: "products",
        label: "Товары",
        icon: ShoppingBag,
      },
      {
        key: "notifications",
        label: "Уведомл.",
        icon: Bell,
      },
      {
        key: "profile",
        label: "Профиль",
        icon: User,
      },
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
        background: "#EAEFF5",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          margin: "0 auto",
          minHeight: "100vh",
          background: "#F4F7FB",
          position: "relative",
          overflowX: "hidden",
          boxShadow:
            "0 0 40px rgba(15,23,42,.08)",
        }}
      >
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            background: "#FFFFFF",
            padding: "16px",
            borderBottom: "1px solid #E2E8F0",
          }}
        >
          <div
            style={{
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

        <main
          style={{
            paddingBottom: "110px",
          }}
        >
          {children}
        </main>

        <nav
          style={{
            position: "fixed",
            bottom: "8px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "calc(100% - 16px)",
            maxWidth: "414px",
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
    </div>
  );
}
