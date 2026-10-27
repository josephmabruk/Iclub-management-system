import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import MembershipForm from "./_components/MembershipForm";

export const metadata: Metadata = { title: "Membership" };

const MembershipStepPage = () => {
  return (
    <Card
      className="mx-auto max-w-2xl"
      header={
        <div>
          <h1 className="text-lg font-semibold">Membership</h1>
          <p className="muted text-sm">
            Step 4 of 6 · Choose how people become members of your club.
          </p>
        </div>
      }
    >
      <MembershipForm />
    </Card>
  );
};

export default MembershipStepPage;
