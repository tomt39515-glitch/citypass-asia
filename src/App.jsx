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
import PartnerTopupPage from "./pages/PartnerTopupPage";
import ClientPartnerPage from "./pages/ClientPartnersPage";
import ReviewModal from "./components/reviews/ReviewModal";

function App() {
  const telegramUser =
    window.Telegram?.WebApp?.initDataUnsafe?.user;

  const telegramId = telegramUser?.id;

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

  const [clientSelectedPartner, setClientSelectedPartner] =
    useState(null);

  const [topupPartner, setTopupPartner] =
    useState(null);

  const [showTopupPage, setShowTopupPage] =
    useState(false);

  const [
    showPartnerRegistration,
    setShowPartnerRegistration,
  ] = useState(false);

  const [clientId, setClientId] =
    useState(null);

  const [reviewVisit, setReviewVisit] =
    useState(null);

  const [showReviewModal, setShowReviewModal] =
    useState(false);

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

  useEffect(() => {
    if (!clientId) return;

    const channel =
      supabase.channel(
        `client-visits-${clientId}`
      );

    channel.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "client_visits",
      },
      async (payload) => {
        const visit = payload.new;

        if (
          Number(visit.client_id) !==
          Number(clientId)
        ) {
          return;
        }

        const {
          data: existingReview,
        } = await supabase
          .from("partner_reviews")
          .select("id")
          .eq("visit_id", visit.id)
          .maybeSingle();

        if (existingReview) {
          return;
        }

        setReviewVisit(visit);
        setShowReviewModal(true);
      }
    );

    channel.subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId]);

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
        setClientId(existingClient.id);
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

      const { data: newClient } =
        await supabase
          .from("clients")
          .insert({
            telegram_id: String(
              telegramId
            ),
            full_name: fullName,
            total_spent: 0,
          })
          .select()
          .single();

      if (newClient) {
        setClientId(newClient.id);
      }
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
        if (clientSelectedPartner) {
          return (
            <ClientPartnerPage
              partner={clientSelectedPartner}
              onBack={() =>
                setClientSelectedPartner(null)
              }
            />
          );
        }

        return (
          <ClientDashboard
            currentTab={currentTab}
            onChangeTab={setCurrentTab}
            transactions={[]}
            role={role}
            setRole={safeSetRole}
            userRoles={userRoles}
            onOpenPartner={(partner) =>
              setClientSelectedPartner(partner)
            }
          />
        );

      case "partner":
        if (
          showTopupPage &&
          topupPartner
        ) {
          return (
            <PartnerTopupPage
              partner={topupPartner}
              onBack={() => {
                setShowTopupPage(false);
                setTopupPartner(null);
              }}
              onSuccess={() => {
                setShowTopupPage(false);
                setTopupPartner(null);
                alert(
                  "Заявка на пополнение отправлена"
                );
              }}
            />
          );
        }

        return (
          <PartnerDashboard
            currentTab={currentTab}
            role={role}
            setRole={safeSetRole}
            userRoles={userRoles}
            onOpenTopup={(partner) => {
              setTopupPartner(partner);
              setShowTopupPage(true);
            }}
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
        if (
          String(telegramId) !==
          "8052071718"
        ) {
          return null;
        }

        if (selectedPartner) {
          return (
            <PartnerDetailsPage
              partner={selectedPartner}
              onBack={() =>
                setSelectedPartner(
                  null
                )
              }
            />
          );
        }

        return (
          <AdminDashboard
            currentTab={currentTab}
            role={role}
            setRole={safeSetRole}
            userRoles={userRoles}
            onOpenPartner={(partner) => {
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
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
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

      {showReviewModal &&
        reviewVisit && (
          <ReviewModal
            visit={reviewVisit}
            onClose={() => {
              setShowReviewModal(false);
              setReviewVisit(null);
            }}
          />
        )}
    </>
  );
}

export default App;
