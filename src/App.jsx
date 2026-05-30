import React, { useState } from "react";

import AppLayout from "./layouts/AppLayout";

import ClientDashboard from "./dashboards/ClientDashboard";
import PartnerDashboard from "./dashboards/PartnerDashboard";
import AgentDashboard from "./dashboards/AgentDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

function App() {
  const [role, setRole] = useState("client");
  const [currentTab, setCurrentTab] = useState("home");

  const renderContent = () => {
    if (role === "client") {
      return (
        <ClientDashboard
          currentTab={currentTab}
          transactions={[]}
          role={role}
          setRole={setRole}
        />
      );
    }

    if (role === "partner") {
      return (
        <PartnerDashboard
          currentTab={currentTab}
        />
      );
    }

    if (role === "agent") {
      return (
        <AgentDashboard
          currentTab={currentTab}
        />
      );
    }

    if (role === "admin") {
      return (
        <AdminDashboard
          currentTab={currentTab}
        />
      );
    }

    return null;
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