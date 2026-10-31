"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { useAddMemberMutation } from "@/store/api/membersApi";

const AddMemberForm = ({ onDone }: { onDone: () => void }) => {
  /**VARIABLES */
  const { user } = useAuth();
  const [addMember, { isLoading, error }] = useAddMemberMutation();
  const units = user?.club?.units ?? [];

  /**FUNCTIONS */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const result = await addMember({
      memberNumber: String(form.get("memberNumber")),
      fullName: String(form.get("fullName")),
      unitId: String(form.get("unitId")) || null,
    });
    if (!result.error) onDone();
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Input
          id="member-number"
          name="memberNumber"
          label="Member number"
          required
        />
        <Input id="member-name" name="fullName" label="Full name" required />
        <div>
          <label
            htmlFor="member-unit"
            className="mb-1 block text-sm font-medium"
          >
            Unit (optional)
          </label>
          <select
            id="member-unit"
            name="unitId"
            className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
          >
            <option value="">No unit</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}

      <div className="flex gap-2">
        <Button type="submit" loading={isLoading}>
          Save member
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddMemberForm;
