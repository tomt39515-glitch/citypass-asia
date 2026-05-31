import PartnerHomeTab from "../components/partner/PartnerHomeTab";
import ScannerTab from "../components/partner/ScannerTab";
import TransactionsTab from "../components/partner/TransactionsTab";
import PartnerProfileTab from "../components/partner/PartnerProfileTab";

export default function PartnerDashboard(props) {
  const { currentTab } = props;

  switch (currentTab) {
    case "home":
      return <PartnerHomeTab {...props} />;

    case "scanner":
      return <ScannerTab {...props} />;

    case "transactions":
      return <TransactionsTab {...props} />;

    case "profile":
      return <PartnerProfileTab {...props} />;

    default:
      return <PartnerHomeTab {...props} />;
  }
}