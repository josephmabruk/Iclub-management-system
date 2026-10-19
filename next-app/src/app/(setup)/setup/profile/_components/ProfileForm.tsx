"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SETUP_STEPS } from "@/constants";
import { getErrorMessage } from "@/lib/utils";
import { useCreateClubMutation } from "@/store/api/clubApi";

const ProfileForm = () => {
  /**VARIABLES */
  const router = useRouter();
  const [createClub, { isLoading, error }] = useCreateClubMutation();

  /**FUNCTIONS */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const result = await createClub({
      name: String(form.get("name")),
      shortCode: String(form.get("shortCode")),
      purpose: String(form.get("purpose")),
      foundingDate: String(form.get("foundingDate")),
      // TODO: shortCode, purpose and foundingDate, same pattern as name
    });

    if (!result.error) router.push(SETUP_STEPS[1].href);
  };

  /**COMPONENT */
  //This is the profile form for the first step of forming the club.
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="club-name"
        name="name"
        label="Club name"
        hint="Enter club name."
        required
      />
      {/* TODO: short code field */}
      <Input
        id="club-shortcode"
        name="shortCode"
        label="Short Code"
        hint="Short unique name that identifies your club. Cannot be changed later!"
        required
      />
      {/* TODO: purpose field */}
      <Input
        id="club-purpose"
        name="purpose"
        label="Purpose"
        hint="What is your club for?"
        required
      />

      {/* TODO: founding date field */}
      <Input
        id="foundingDate"
        name="foundingDate"
        label="Founding Date"
        hint=""
        type="date"
        max={new Date().toISOString().split("T")[0]}
        required
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          Continue to institution
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
