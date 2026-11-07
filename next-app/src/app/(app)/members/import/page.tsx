import type { Metadata } from "next";
import ImportWizard from "./_components/ImportWizard";
import RequirePermission from "@/components/shared/RequirePermission";

export const metadata: Metadata = { title: "Roster import" };

const ImportPage = () => {
  <RequirePermission permission="members.import">
    return <ImportWizard />;
  </RequirePermission>;
  return <ImportWizard />;
};

export default ImportPage;
