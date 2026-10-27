import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import PositionsForm from "./_components/PositionsForm";

export const metadata: Metadata = { title: "Positions" };

const PositionsStepPage = () => {
  return (
    <Card
      className="mx-auto max-w-3xl"
      header={
        <div>
          <h1 className="text-lg font-semibold">Positions</h1>
          <p className="muted text-sm">
            Step 5 of 6 · Define your committee&apos;s offices.
          </p>
        </div>
      }
    >
      <PositionsForm />
    </Card>
  );
};

export default PositionsStepPage;
