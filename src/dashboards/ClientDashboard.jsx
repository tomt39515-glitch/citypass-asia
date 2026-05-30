import HomeTab from "../components/client/HomeTab";
import QRTab from "../components/client/QRTab";
import HistoryTab from "../components/client/HistoryTab";
import ProfileTab from "../components/client/ProfileTab";
import NotificationsTab from "../components/client/NotificationsTab";

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

  if (currentTab === "profile") {
    return <ProfileTab {...props} />;
  }

  return null;
}