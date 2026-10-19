import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import ProfileForm from "./_components/ProfileForm";

export const metadata: Metadata = { title: "Club profile" };

const ProfileStepPage = () => {
  return (
    <Card
      className="mx-auto max-w-2xl"
      header={
        <div>
          <h1 className="text-lg font-semibold">Club profile</h1>
          <p className="muted text-sm">
            Step 1 of 6 · The name your committee will see across iClub.
          </p>
        </div>
      }
    >
      <ProfileForm />
    </Card>
  );
};

export default ProfileStepPage;
