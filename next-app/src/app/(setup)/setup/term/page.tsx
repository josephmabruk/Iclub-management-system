import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import TermForm from "./_components/TermForm";

export const metadata: Metadata = { title: "Term setup" };

const TermStepPage = () => {
  return (
    <Card
      className="mx-auto max-w-2xl"
      header={
        <div>
          <h1 className="text-lg font-semibold">Term setup</h1>
          <p className="muted text-sm">
            Step 6 of 6 · Give this committee&apos;s records a clear time frame.
          </p>
        </div>
      }
    >
      <TermForm />
    </Card>
  );
};

export default TermStepPage;
