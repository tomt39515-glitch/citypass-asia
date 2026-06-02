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

  const [userRoles, setUserRoles] =
    useState(["client"]);

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
    loadRoles();
  }, [telegramId]);

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

  async function loadRoles() {
    try {
      if (!telegramId) return;

      const { data, error } =
        await supabase
          .from("user_roles")
          .select("role")
          .eq(
            "telegram_id",
            String(telegramId)
          );

      if (error) {
        console.error(error);
        return;
      }

      const roles =
        data?.map(
          (item) => item.role
        ) || [];

      if (
        roles.length === 0
      ) {
        setUserRoles([
          "client",
        ]);
        return;
      }

      setUserRoles(roles);

      if (
        roles.includes(
          "partner"
        )
      ) {
        setRole(
          "partner"
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

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
    if (
      !userRoles.includes(
        newRole
      )
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
          !userRoles.includes(
            "admin"
          )
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