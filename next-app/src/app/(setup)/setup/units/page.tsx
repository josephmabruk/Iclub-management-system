import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import UnitsForm from "./_components/UnitsForm";

export const metadata: Metadata = { title: "Units" };

const UnitsStepPage = () => {
  return (
    <Card
      className="mx-auto max-w-2xl"
      header={
        <div>
          <h1 className="text-lg font-semibold">Units</h1>
          <p className="muted text-sm">
            Step 3 of 6 · Groups that organise your members, such as sections or
            teams. Units are optional.
          </p>
        </div>
      }
    >
      <UnitsForm />
    </Card>
  );
};

export default UnitsStepPage;
