import type { Metadata } from "next";
import ImportWizard from "./_components/ImportWizard";

export const metadata: Metadata = { title: "Roster import" };

const ImportPage = () => {
  return <ImportWizard />;
};

export default ImportPage;
