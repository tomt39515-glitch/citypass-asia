import React from "react";
import {
  Home,
  QrCode,
  History,
  Bell,
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
      { key: "offers", label: "Скидки", icon: Briefcase },
      { key: "qr", label: "QR", icon: QrCode },
      { key: "history", label: "История", icon: History },
      { key: "profile", label: "Профиль", icon: User },
    ],

    partner: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "scanner", label: "Scanner", icon: ScanLine },
      { key: "transactions", label: "История", icon: History },
      { key: "balance", label: "Баланс", icon: Wallet },
      { key: "analytics", label: "Аналитика", icon: BarChart3 },
    ],

    admin: [
      { key: "dashboard", label: "Dashboard", icon: Shield },
      { key: "partners", label: "Партнёры", icon: Briefcase },
      { key: "clients", label: "Клиенты", icon: Users },
      { key: "topups", label: "Пополнения", icon: Wallet },
      { key: "transactions", label: "Транзакции", icon: CreditCard },
    ],

    agent: [
      { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { key: "partners", label: "Партнёры", icon: Briefcase },
      { key: "earnings", label: "Доход", icon: Wallet },
    ],
  };

  const tabs = tabsByRole[role] || [];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">
            CityPass Asia
          </h1>

          <p className="text-xs text-slate-500 capitalize">
            {role} panel
          </p>
        </div>

        <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
          C
        </div>
      </header>

      <main className="flex-1 p-4 pb-28 overflow-y-auto">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = currentTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => onChangeTab(tab.key)}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-all ${
                active
                  ? "bg-orange-500 text-white"
                  : "text-slate-500"
              }`}
            >
              <Icon size={20} />

              <span className="text-[10px] mt-1">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}