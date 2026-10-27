import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import InstitutionForm from "./_components/InstitutionForm";

export const metadata: Metadata = { title: "Institution" };

const InstitutionStepPage = () => {
  return (
    <Card
      className="mx-auto max-w-2xl"
      header={
        <div>
          <h1 className="text-lg font-semibold">Institution</h1>
          <p className="muted text-sm">
            Step 2 of 6 · Link your club to an institution if it has one. This
            step is optional.
          </p>
        </div>
      }
    >
      <InstitutionForm />
    </Card>
  );
};

export default InstitutionStepPage;
