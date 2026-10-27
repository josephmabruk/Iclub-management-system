"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SETUP_STEPS } from "@/constants";
import { getErrorMessage } from "@/lib/utils";
import { useUpdateClubMutation } from "@/store/api/clubApi";

const InstitutionForm = () => {
  /**VARIABLES */
  const router = useRouter();
  const [updateClub, { isLoading, error }] = useUpdateClubMutation();
  const nextHref = SETUP_STEPS[2].href;

  /**FUNCTIONS */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const institution = String(form.get("institution")).trim();

    // An empty field means "no institution", so there is nothing to save.
    if (!institution) {
      router.push(nextHref);
      return;
    }

    const result = await updateClub({ institution });
    if (!result.error) router.push(nextHref);
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="institution"
        name="institution"
        label="Institution name (optional)"
        hint="Leave this blank if your club is independent."
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}

      <div className="flex items-center justify-between">
        {/* TODO: a "Skip for now →" link to nextHref */}
        <Button type="submit" loading={isLoading}>
          Continue to units
        </Button>
      </div>
    </form>
  );
};

export default InstitutionForm;
