import type { Metadata } from "next";
import RequirePermission from "@/components/shared/RequirePermission";
import FinanceContent from "./_components/FinanceContent";

export const metadata: Metadata = { title: "Finance" };

const FinancePage = () => {
  return (
    <RequirePermission permission="finance.view">
      <FinanceContent />
    </RequirePermission>
  );
};

export default FinancePage;
