"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DOCUMENT_TYPES, RECORD_KINDS } from "@/constants";
import { getErrorMessage } from "@/lib/utils";
import { useRegisterRecordMutation } from "@/store/api/recordsApi";
import type { DocumentType, RecordKind } from "@/types";

type Props = { offices: { id: string; label: string }[]; onDone: () => void };

const SELECT =
  "w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm";

const RegisterRecordForm = ({ offices, onDone }: Props) => {
  /**VARIABLES */
  const [register, { isLoading, error }] = useRegisterRecordMutation();
  const [kind, setKind] = useState<RecordKind>("document");

  /**FUNCTIONS */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const text = (key: string) => String(form.get(key) ?? "");

    const result = await register({
      kind,
      name: text("name"),
      description: text("description"),
      mark: text("mark"),
      location: text("location"),
      officeId: text("officeId"),
      docType:
        kind === "document" ? (text("docType") as DocumentType) : undefined,
      period: kind === "document" ? text("period") : undefined,
    });
    if (!result.error) onDone();
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="rounded-lg bg-warn-50 p-3 text-sm text-amber-800">
        iClub records where things are held. It never stores files, keys or
        passwords. For an online account, record only its handle.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="rec-kind" className="mb-1 block text-sm font-medium">
            What are you registering?
          </label>
          <select
            id="rec-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as RecordKind)}
            className={SELECT}
          >
            {Object.entries(RECORD_KINDS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <Input
          id="rec-name"
          name="name"
          label={kind === "document" ? "Title" : "Name"}
          required
        />

        {kind === "document" && (
          <>
            <div>
              <label
                htmlFor="rec-type"
                className="mb-1 block text-sm font-medium"
              >
                Document type
              </label>
              <select id="rec-type" name="docType" required className={SELECT}>
                {Object.entries(DOCUMENT_TYPES).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <Input
              id="rec-period"
              name="period"
              label="Period (optional)"
              hint="For example 2026 or 2026/27"
            />
          </>
        )}
        {kind === "asset" && (
          <Input
            id="rec-mark"
            name="mark"
            label="Identifying mark (optional)"
            hint="A serial number, tag or label"
          />
        )}
        {kind === "account" && (
          <Input
            id="rec-handle"
            name="mark"
            label="Account handle"
            hint="For example club.kea@gmail.com. Never a password."
            required
          />
        )}

        <Input
          id="rec-location"
          name="location"
          label="Where is it held?"
          hint="A place or a link. Never a password."
          required
        />
        <div>
          <label
            htmlFor="rec-office"
            className="mb-1 block text-sm font-medium"
          >
            Holding office
          </label>
          <select id="rec-office" name="officeId" required className={SELECT}>
            {offices.map((office) => (
              <option key={office.id} value={office.id}>
                {office.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <Input
        id="rec-description"
        name="description"
        label="Description (optional)"
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}
      <div className="flex gap-2">
        <Button type="submit" loading={isLoading}>
          Register
        </Button>
        <Button type="button" variant="ghost" onClick={onDone}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default RegisterRecordForm;
