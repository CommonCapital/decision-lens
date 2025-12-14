import { InvestorDashboard } from "@/components/dashboard/InvestorDashboard";
import { mockDashboardData } from "@/lib/mock-data";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>{mockDashboardData.run_metadata.entity} | Investor Dashboard</title>
        <meta
          name="description"
          content={`Decision-grade investor dashboard for ${mockDashboardData.run_metadata.entity}. Real-time financials, scenarios, and risk analysis with full data provenance.`}
        />
      </Helmet>
      <InvestorDashboard data={mockDashboardData} />
    </>
  );
};

export default Index;
