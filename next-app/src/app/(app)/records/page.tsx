import type { Metadata } from "next";
import RecordsContent from "./_components/RecordsContent";

export const metadata: Metadata = { title: "Records & custody" };

const RecordsPage = () => {
  return <RecordsContent />;
};

export default RecordsPage;
