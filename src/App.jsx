import React, { useState } from "react";

import AppLayout from "./layouts/AppLayout";

import ClientDashboard from "./dashboards/ClientDashboard";
import PartnerDashboard from "./dashboards/PartnerDashboard";
import AgentDashboard from "./dashboards/AgentDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

function App() {
  const telegramId =
    window.Telegram?.WebApp?.initDataUnsafe?.user?.id;

  const [role, setRole] = useState("client");
  const [currentTab, setCurrentTab] = useState("home");

  const [userRoles] = useState(
    telegramId === 8052071718
      ? ["client", "partner", "agent", "admin"]
      : ["client", "partner", "agent"]
  );

  const safeSetRole = (newRole) => {
    if (
      newRole === "admin" &&
      telegramId !== 8052071718
    ) {
      return;
    }

    setRole(newRole);
  };

  const renderContent = () => {
    switch (role) {
      case "client":
        return (
          <ClientDashboard
            currentTab={currentTab}
            transactions={[]}
            role={role}
            setRole={safeSetRole}
            userRoles={userRoles}
          />
        );

      case "partner":
        return (
          <PartnerDashboard
            currentTab={currentTab}
            role={role}
            setRole={safeSetRole}
            userRoles={userRoles}
          />
        );

      case "agent":
        return (
          <AgentDashboard
            currentTab={currentTab}
            role={role}
            setRole={safeSetRole}
            userRoles={userRoles}
          />
        );

      case "admin":
        if (telegramId !== 8052071718) {
          return null;
        }

        return (
          <AdminDashboard
            currentTab={currentTab}
            role={role}
            setRole={safeSetRole}
            userRoles={userRoles}
          />
        );

      default:
        return null;
    }
  };

  return (
    <AppLayout
      role={role}
      currentTab={currentTab}
      onChangeTab={setCurrentTab}
    >
      {renderContent()}
    </AppLayout>
  );
}

export default App;