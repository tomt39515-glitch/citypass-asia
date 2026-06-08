import React from "react";
import {
  Home,
  User,
  LayoutDashboard,
  ScanLine,
  Wallet,
  Shield,
  Users,
  CreditCard,
  Briefcase,
  Bell,
  ShoppingBag,
  MapPinned,
} from "lucide-react";

export default function AppLayout({
  role,
  currentTab,
  onChangeTab,
  children,
}) {
  const tabsByRole = {
    client: [
      {
        key: "home",
        label: "Главная",
        icon: Home,
      },
      {
        key: "offers",
        label: "Партнёры",
        icon: Briefcase,
      },
      {
        key: "map",
        label: "Карта",
        icon: MapPinned,
      },
      {
        key: "orders",
        label: "Заказы",
        icon: ShoppingBag,
      },
      {
        key: "profile",
        label: "Профиль",
        icon: User,
      },
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
        key: "orders",
        label: "Заказы",
        icon: ShoppingBag,
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
      {
        key: "dashboard",
        label: "Панель",
        icon: Shield,
      },
      {
        key: "partners",
        label: "Партнёры",
        icon: Briefcase,
      },
      {
        key: "clients",
        label: "Клиенты",
        icon: Users,
      },
      {
        key: "topups",
        label: "Баланс",
        icon: Wallet,
      },
      {
        key: "transactions",
        label: "Операции",
        icon: CreditCard,
      },
    ],

    agent: [
      {
        key: "dashboard",
        label: "Главная",
        icon: LayoutDashboard,
      },
      {
        key: "partners",
        label: "Партнёры",
        icon: Briefcase,
      },
      {
        key: "earnings",
        label: "Доход",
        icon: Wallet,
      },
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
          background: "#F7FAFB",
          position: "relative",
          overflowX: "hidden",
          boxShadow:
            "0 0 40px rgba(15,23,42,.08)",
        }}
      >
        <main
          style={{
            paddingBottom: "130px",
          }}
        >
          {children}
        </main>

        <nav
          style={{
            position: "fixed",
            bottom: "0",
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "414px",
            background: "#FFFFFF",
            borderTopLeftRadius: "30px",
borderTopRightRadius: "30px",
borderBottomLeftRadius: "0",
borderBottomRightRadius: "0",
            padding: "10px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            boxShadow:
              "0 15px 40px rgba(15,23,42,.15)",
            zIndex: 1000,
          }}
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active =
              currentTab === tab.key;

            const isMap =
              tab.key === "map";

            return (
              <button
                key={tab.key}
                onClick={() =>
                  onChangeTab(tab.key)
                }
                style={{
                  flex: 1,
                  border: "none",
                  background: "transparent",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  cursor: "pointer",
                  color: active
                    ? "#0F766E"
                    : "#64748B",
                }}
              >
                {isMap ? (
                  <div
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg,#14B8A6,#0F766E)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#FFFFFF",
                      marginTop: "-45px",
                      boxShadow:
                        "0 12px 30px rgba(20,184,166,.35)",
                    }}
                  >
                    <Icon size={30} />
                  </div>
                ) : (
                  <Icon size={22} />
                )}

                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: active
                      ? 700
                      : 500,
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