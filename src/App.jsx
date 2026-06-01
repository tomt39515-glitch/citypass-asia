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

function App() {
  const telegramUser =
    window.Telegram?.WebApp?.initDataUnsafe?.user;

  const telegramId = telegramUser?.id;

  const [role, setRole] =
    useState("client");

  const [currentTab, setCurrentTab] =
    useState("home");

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
        console.log(
          "Client already exists"
        );
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

      const { error } =
        await supabase
          .from("clients")
          .insert({
            telegram_id: String(
              telegramId
            ),
            full_name: fullName,
            total_spent: 0,
          });

      console.log(
        "CLIENT CREATE ERROR:",
        error
      );
    } catch (err) {
      console.error(
        "REGISTER ERROR:",
        err
      );
    }
  }

  const [userRoles] = useState(
    telegramId === 8052071718
      ? [
          "client",
          "partner",
          "agent",
          "admin",
        ]
      : [
          "client",
        ]
  );

  const safeSetRole = (
    newRole
  ) => {
    if (
      newRole === "admin" &&
      telegramId !==
        8052071718
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
          telegramId !==
          8052071718
        ) {
          return null;
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
        currentTab={currentTab}
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