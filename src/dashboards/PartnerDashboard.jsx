import PartnerHomeTab from "../components/partner/PartnerHomeTab";
import PartnerScanner from "../components/partner/PartnerScanner";
import TransactionsTab from "../components/partner/TransactionsTab";
import PartnerProfileTab from "../components/partner/PartnerProfileTab";

export default function PartnerDashboard(props) {
  const { currentTab } = props;

  switch (currentTab) {
    case "home":
      return <PartnerHomeTab {...props} />;

    case "scanner":
      return <PartnerScanner {...props} />;

    case "transactions":
      return <TransactionsTab {...props} />;

    case "profile":
      return <PartnerProfileTab {...props} />;

    default:
      return <PartnerHomeTab {...props} />;
  }
}