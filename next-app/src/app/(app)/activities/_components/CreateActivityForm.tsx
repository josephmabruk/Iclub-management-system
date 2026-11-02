"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { useCreateActivityMutation } from "@/store/api/activitiesApi";

const CreateActivityForm = ({ onDone }: { onDone: () => void }) => {
  /**VARIABLES */
  const { user } = useAuth();
  const [createActivity, { isLoading, error }] = useCreateActivityMutation();
  const units = user?.club?.units ?? [];

  /**FUNCTIONS */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await createActivity({
      name: String(form.get("name")),
      date: String(form.get("date")),
      startTime: String(form.get("startTime")),
      endTime: String(form.get("endTime")),
      location: String(form.get("location")),
      unitId: String(form.get("unitId")) || null,
    });
    if (!result.error) onDone();
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="act-name" name="name" label="Activity name" required />
        <Input id="act-location" name="location" label="Location" required />
        <Input id="act-date" name="date" label="Date" type="date" required />
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="act-start"
            name="startTime"
            label="Start"
            type="time"
            required
          />
          <Input id="act-end" name="endTime" label="End" type="time" required />
        </div>
        <div>
          <label htmlFor="act-unit" className="mb-1 block text-sm font-medium">
            Who is it for?
          </label>
          <select
            id="act-unit"
            name="unitId"
            className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm"
          >
            <option value="">Whole club</option>
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                {unit.name} only
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
          Create activity
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateActivityForm;
