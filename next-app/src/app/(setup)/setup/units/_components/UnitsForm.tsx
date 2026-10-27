"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SETUP_STEPS } from "@/constants";
import { getErrorMessage } from "@/lib/utils";
import { useUpdateClubMutation } from "@/store/api/clubApi";

const UnitsForm = () => {
  /**VARIABLES */
  const router = useRouter();
  const [updateClub, { isLoading, error }] = useUpdateClubMutation();
  const [names, setNames] = useState<string[]>([""]);
  const [formError, setFormError] = useState("");
  const nextHref = SETUP_STEPS[3].href;

  /**FUNCTIONS */
  const changeName = (index: number, value: string) => {
    setNames((current) =>
      current.map((name, i) => (i === index ? value : name)),
    );
  };

  const addRow = () => setNames((current) => [...current, ""]);

  const removeRow = (index: number) => {
    setNames((current) => current.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleaned = names.map((name) => name.trim()).filter(Boolean);
    const lowered = cleaned.map((name) => name.toLowerCase());

    //Handles the case of similar unit names.
    if (new Set(lowered).size !== lowered.length) {
      setFormError("Unit names must be different");
      return;
    }

    setFormError("");

    // Units are optional, so an empty list just moves on.
    if (cleaned.length === 0) {
      router.push(nextHref);
      return;
    }

    const result = await updateClub({
      units: cleaned.map((name) => ({ id: crypto.randomUUID(), name })),
    });
    if (!result.error) router.push(nextHref);
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        {names.map((name, index) => (
          <div key={index} className="flex items-end gap-2">
            <Input
              id={`unit-${index}`}
              label={`Unit ${index + 1}`}
              value={name}
              onChange={(event) => changeName(index, event.target.value)}
            />
            <Button
              type="button"
              variant="ghost"
              aria-label={`Remove unit ${index + 1}`}
              onClick={() => removeRow(index)}
            >
              ✕
            </Button>
          </div>
        ))}
      </div>

      <div>
        <Button type="button" variant="ghost" onClick={addRow}>
          Add unit
        </Button>
      </div>

      {(formError || error) && (
        <p role="alert" className="text-sm text-red-600">
          {formError || getErrorMessage(error)}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          Continue to membership
        </Button>
      </div>
    </form>
  );
};

export default UnitsForm;
