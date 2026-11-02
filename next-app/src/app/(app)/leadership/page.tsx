import type { Metadata } from "next";
import LeadershipContent from "./_components/LeadershipContent";

export const metadata: Metadata = { title: "Leadership" };

const LeadershipPage = () => {
  return <LeadershipContent />;
};

export default LeadershipPage;
