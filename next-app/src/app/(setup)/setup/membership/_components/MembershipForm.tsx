"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import { SETUP_STEPS } from "@/constants";
import { cn, getErrorMessage } from "@/lib/utils";
import { useUpdateClubMutation } from "@/store/api/clubApi";
import type { MembershipSource } from "@/types";

const OPTIONS: {
  value: MembershipSource;
  title: string;
  description: string;
}[] = [
  {
    value: "import_roster",
    title: "Imported roster",
    description:
      "Membership follows a CSV list, such as the registrar's. Officers import it, and members can't be added by hand.",
  },
  {
    value: "officer_added",
    title: "Added by officers",
    description:
      "Officers type each member into the register themselves. Best for small clubs without an official list.",
  },
];

const MembershipForm = () => {
  /**VARIABLES */
  const router = useRouter();
  const [updateClub, { isLoading, error }] = useUpdateClubMutation();
  const [source, setSource] = useState<MembershipSource | null>(null);
  const [formError, setFormError] = useState("");

  /**FUNCTIONS */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!source) {
      setFormError("Choose how your club adds members");
      return;
    }
    setFormError("");

    const result = await updateClub({ membershipSource: source });
    if (!result.error) router.push(SETUP_STEPS[4].href);
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-medium">
          How does your club decide who its members are?
        </legend>

        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex cursor-pointer gap-3 rounded-lg border p-4",
              source === option.value
                ? "border-brand-600 bg-brand-50"
                : "border-gray-300 hover:border-gray-400",
            )}
          >
            <input
              type="radio"
              name="membershipSource"
              value={option.value}
              checked={source === option.value}
              onChange={() => setSource(option.value)}
              className="mt-1 accent-brand-600"
            />
            <span>
              <span className="block text-sm font-semibold">
                {option.title}
              </span>
              <span className="muted block text-sm">
                {option.description}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      {(formError || error) && (
        <p role="alert" className="text-sm text-red-600">
          {formError || getErrorMessage(error)}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          Continue to positions
        </Button>
      </div>
    </form>
  );
};

export default MembershipForm;