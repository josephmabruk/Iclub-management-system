"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { SETUP_STEPS } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { useUpdateClubMutation } from "@/store/api/clubApi";
import type { PositionDraft } from "@/types";

const newPosition = (name = "", requiredOffice = false): PositionDraft => ({
  id: crypto.randomUUID(),
  name,
  unitId: null,
  requiredOffice,
  inVerifiedRoster: true,
});

const PositionsForm = () => {
  /**VARIABLES */
  const router = useRouter();
  const { user } = useAuth();
  const [updateClub, { isLoading, error }] = useUpdateClubMutation();
  const units = user?.club?.units ?? [];

  // Starter offices so a new club isn't facing a blank page. Editable.
  const [positions, setPositions] = useState<PositionDraft[]>([
    newPosition("Chairperson", true),
    newPosition("Secretary", true),
    newPosition("Treasurer", true),
  ]);
  const [formError, setFormError] = useState("");

  /**FUNCTIONS */
  const updatePosition = (id: string, changes: Partial<PositionDraft>) => {
    setPositions((current) =>
      current.map((p) => (p.id === id ? { ...p, ...changes } : p)),
    );
  };

  const addPosition = () =>
    setPositions((current) => [...current, newPosition()]);

  const removePosition = (id: string) => {
    setPositions((current) => current.filter((p) => p.id !== id));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleaned = positions
      .map((p) => ({ ...p, name: p.name.trim() }))
      .filter((p) => p.name);

    if (cleaned.length === 0) {
      setFormError("Add at least one position");
      return;
    }

    // TODO: reject two positions with the same name in the same unit
    //       (see "Your challenge" below)
    const keys = cleaned.map(
      (p) => `${p.name.toLowerCase()}|${p.unitId ?? "club"}`,
    );
    if (new Set(keys).size !== keys.length) {
      setFormError("Two positions have the same name in the same unit");
      return;
    }
    setFormError("");

    const result = await updateClub({ positions: cleaned });
    if (!result.error) router.push(SETUP_STEPS[5].href);
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <p className="rounded-lg bg-brand-50 p-3 text-sm text-brand-900">
        Each position has exactly one holder at a time. This step defines the
        offices, not who holds them.
      </p>

      {positions.map((position, index) => (
        <div
          key={position.id}
          className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              id={`position-name-${index}`}
              label="Position name"
              value={position.name}
              onChange={(event) =>
                updatePosition(position.id, { name: event.target.value })
              }
            />
            <div>
              <label
                htmlFor={`position-unit-${index}`}
                className="mb-1 block text-sm font-medium"
              >
                Unit
              </label>
              <select
                id={`position-unit-${index}`}
                value={position.unitId ?? ""}
                onChange={(event) =>
                  updatePosition(position.id, {
                    unitId: event.target.value || null,
                  })
                }
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
              >
                <option value="">Whole club</option>
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={position.requiredOffice}
                onChange={(event) =>
                  updatePosition(position.id, {
                    requiredOffice: event.target.checked,
                  })
                }
                className="accent-brand-600"
              />
              Required office
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={position.inVerifiedRoster}
                onChange={(event) =>
                  updatePosition(position.id, {
                    inVerifiedRoster: event.target.checked,
                  })
                }
                className="accent-brand-600"
              />
              Included in verified roster
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={() => removePosition(position.id)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}

      <div>
        <Button type="button" variant="ghost" onClick={addPosition}>
          Add position
        </Button>
      </div>

      {(formError || error) && (
        <p role="alert" className="text-sm text-red-600">
          {formError || getErrorMessage(error)}
        </p>
      )}

      <div className="flex justify-end">
        <Button type="submit" loading={isLoading}>
          Continue to term setup
        </Button>
      </div>
    </form>
  );
};

export default PositionsForm;
