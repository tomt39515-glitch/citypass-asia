import PartnerDepositsTab from "../components/partner/PartnerDepositsTab";
import PartnerHomeTab from "../components/partner/PartnerHomeTab";
import PartnerScanner from "../components/partner/PartnerScanner";
import TransactionsTab from "../components/partner/TransactionsTab";
import PartnerProfileTab from "../components/partner/PartnerProfileTab";
import PartnerNotificationsTab from "../components/partner/PartnerNotificationsTab";
import PartnerProductsTab from "../components/partner/PartnerProductsTab";
import PartnerOrdersTab from "../components/partner/PartnerOrdersTab";

export default function PartnerDashboard(props) {
  const { currentTab } = props;

  switch (currentTab) {
    case "home":
      return <PartnerHomeTab {...props} />;

    case "orders":
      return <PartnerOrdersTab {...props} />;

    case "scanner":
      return <PartnerScanner {...props} />;

    case "transactions":
      return <TransactionsTab {...props} />;

    case "deposits":
      return <PartnerDepositsTab {...props} />;

    case "products":
      return <PartnerProductsTab {...props} />;

    case "notifications":
      return <PartnerNotificationsTab {...props} />;

    case "profile":
      return <PartnerProfileTab {...props} />;

    default:
      return <PartnerHomeTab {...props} />;
  }
}