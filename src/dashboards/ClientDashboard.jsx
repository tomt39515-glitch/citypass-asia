import MapTab from "../components/client/MapTab";
import HomeTab from "../components/client/HomeTab";
import QRTab from "../components/client/QRTab";
import HistoryTab from "../components/client/HistoryTab";
import ProfileTab from "../components/client/ProfileTab";
import NotificationsTab from "../components/client/NotificationsTab";
import OffersTab from "../components/client/OffersTab";
import ClientOrdersTab from "../components/client/ClientOrdersTab";
import SpecialOffersTab from "../components/client/SpecialOffersTab";

export default function ClientDashboard(props) {
  const { currentTab } = props;

  if (currentTab === "home") {
    return <HomeTab {...props} />;
  }

  if (currentTab === "qr") {
    return <QRTab {...props} />;
  }

  if (currentTab === "history") {
    return <HistoryTab {...props} />;
  }

  if (currentTab === "notifications") {
    return <NotificationsTab {...props} />;
  }

  if (currentTab === "offers") {
    return <OffersTab {...props} />;
  }

  if (currentTab === "special-offers") {
    return <SpecialOffersTab {...props} />;
  }

  if (currentTab === "map") {
    return <MapTab {...props} />;
  }

  if (currentTab === "orders") {
    return <ClientOrdersTab {...props} />;
  }

  if (currentTab === "profile") {
    return <ProfileTab {...props} />;
  }

  return null;
}