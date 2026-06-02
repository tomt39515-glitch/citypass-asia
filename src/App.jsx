import React, {
  useEffect,
  useState,
} from "react";

import { supabase } from "./supabase";

import AppLayout from "./layouts/AppLayout";

import ClientDashboard from "./dashboards/ClientDashboard";
import PartnerDashboard from "./dashboards/PartnerDashboard";
import AgentDashboard from "./dashboards/AgentDashboard";
import AdminDashboard from "./dashboards/AdminDashboard";

import PartnerRegistration from "./components/client/PartnerRegistration";
import PartnerDetailsPage from "./pages/PartnerDetailsPage";

function App() {
  const telegramUser =
    window.Telegram?.WebApp?.initDataUnsafe?.user;

  const telegramId = telegramUser?.id;

  console.log(
    "TELEGRAM ID =",
    telegramId
  );

  const [role, setRole] =
    useState("client");

  const [userRoles] = useState([
    "client",
    "partner",
    "agent",
    "admin",
  ]);

  const [currentTab, setCurrentTab] =
    useState("home");

  const [selectedPartner, setSelectedPartner] =
    useState(null);
useEffect(() => {
  console.log(
    "SELECTED PARTNER =",
    selectedPartner
  );
}, [selectedPartner]);

  const [
    showPartnerRegistration,
    setShowPartnerRegistration,
  ] = useState(false);

  useEffect(() => {
    registerClient();
  }, []);

  useEffect(() => {
    const openPartnerRegistration =
      () => {
        setShowPartnerRegistration(
          true
        );
      };

    window.addEventListener(
      "open-partner-registration",
      openPartnerRegistration
    );

    return () => {
      window.removeEventListener(
        "open-partner-registration",
        openPartnerRegistration
      );
    };
  }, []);

  async function registerClient() {
    try {
      if (!telegramId) return;

      const {
        data: existingClient,
      } = await supabase
        .from("clients")
        .select("id")
        .eq(
          "telegram_id",
          String(telegramId)
        )
        .maybeSingle();

      if (existingClient) {
        return;
      }

      const fullName =
        [
          telegramUser?.first_name,
          telegramUser?.last_name,
        ]
          .filter(Boolean)
          .join(" ") ||
        telegramUser?.username ||
        "CityPass User";

      await supabase
        .from("clients")
        .insert({
          telegram_id: String(
            telegramId
          ),
          full_name: fullName,
          total_spent: 0,
        });
    } catch (err) {
      console.error(err);
    }
  }

  const safeSetRole = (
    newRole
  ) => {
    setRole(newRole);
  };

  const renderContent = () => {
    switch (role) {
      case "client":
        return (
          <ClientDashboard
            currentTab={
              currentTab
            }
            transactions={[]}
            role={role}
            setRole={
              safeSetRole
            }
            userRoles={
              userRoles
            }
          />
        );

      case "partner":
        return (
          <PartnerDashboard
            currentTab={
              currentTab
            }
            role={role}
            setRole={
              safeSetRole
            }
            userRoles={
              userRoles
            }
          />
        );

      case "agent":
        return (
          <AgentDashboard
            currentTab={
              currentTab
            }
            role={role}
            setRole={
              safeSetRole
            }
            userRoles={
              userRoles
            }
          />
        );

      case "admin":
        if (
          String(telegramId) !==
          "8052071718"
        ) {
          return null;
        }
if (selectedPartner) {
  return (
    <div style={{ padding: 20 }}>
      <h1>ПАРТНЕР ВЫБРАН</h1>
      <pre>
        {JSON.stringify(selectedPartner, null, 2)}
      </pre>
    </div>
  );
}
       if (selectedPartner) {
  alert("PARTNER PAGE OPEN");

  return (
    <PartnerDetailsPage
      partner={selectedPartner}
      onBack={() =>
        setSelectedPartner(null)
      }
    />
  );
}

        return (
          <AdminDashboard
            currentTab={
              currentTab
            }
            role={role}
            setRole={
              safeSetRole
            }
            userRoles={
              userRoles
            }
          onOpenPartner={(partner) => {
  alert("SET PARTNER");
  setSelectedPartner(partner);
}}
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <AppLayout
        role={role}
        currentTab={
          currentTab
        }
        onChangeTab={
          setCurrentTab
        }
      >
        {renderContent()}
      </AppLayout>

      {showPartnerRegistration && (
        <PartnerRegistration
          onClose={() =>
            setShowPartnerRegistration(
              false
            )
          }
        />
      )}
    </>
  );
}

export default App;