import type { Metadata } from "next";
import ActivitiesContent from "./_components/ActivitiesContent";

export const metadata: Metadata = { title: "Activities" };

const ActivitiesPage = () => {
  return <ActivitiesContent />;
};

export default ActivitiesPage;
