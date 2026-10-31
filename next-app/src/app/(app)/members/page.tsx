import type { Metadata } from "next";
import MembersContent from "./_components/MembersContent";

export const metadata: Metadata = { title: "Members" };

const MembersPage = () => {
  return <MembersContent />;
};

export default MembersPage;
