"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/constants";
import { getErrorMessage } from "@/lib/utils";
import {
  useCompleteClubMutation,
  useUpdateClubMutation,
} from "@/store/api/clubApi";

const TermForm = () => {
  /**VARIABLES */
  const router = useRouter();
  const [updateClub, { isLoading: saving, error: saveError }] =
    useUpdateClubMutation();
  const [completeClub, { isLoading: finishing, error: finishError }] =
    useCompleteClubMutation();
  const [formError, setFormError] = useState("");

  /**FUNCTIONS */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name")).trim();
    const startDate = String(form.get("startDate"));
    const endDate = String(form.get("endDate"));

    // TODO: if endDate is not after startDate, call
    //       setFormError("The term must end after it starts") and return
    if (endDate <= startDate) {
      setFormError("The term must end after it starts");
      return;
    }
    setFormError("");

    const saved = await updateClub({ term: { name, startDate, endDate } });
    if (saved.error) return;

    const done = await completeClub();
    if (!done.error) router.push(ROUTES.home);
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="term-name"
        name="name"
        label="Term name"
        hint="For example 2026/27"
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          id="term-start"
          name="startDate"
          label="Start date"
          type="date"
          required
        />
        <Input
          id="term-end"
          name="endDate"
          label="End date"
          type="date"
          required
        />
      </div>

      {(formError || saveError || finishError) && (
        <p role="alert" className="text-sm text-red-600">
          {formError || getErrorMessage(saveError ?? finishError)}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={saving || finishing}>
          Finish club setup
        </Button>
      </div>
    </form>
  );
};

export default TermForm;
