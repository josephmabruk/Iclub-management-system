"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { getErrorMessage } from "@/lib/utils";
import { useInviteHolderMutation } from "@/store/api/leadershipApi";

type Props = { memberId: string; memberName: string };

const InviteHolder = ({ memberId, memberName }: Props) => {
  const [open, setOpen] = useState(false);
  const [invite, { data, isLoading, error }] = useInviteHolderMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await invite({ memberId, email: String(form.get("email")) });
  };

  if (!open) {
    return (
      <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>
        Invite to log in
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 text-left">
      {data ? (
        <>
          <p className="text-xs">
            Send this link to {memberName}. It works once and expires in 7 days.
          </p>
          <input
            readOnly
            value={data.link}
            aria-label="Invitation link"
            onFocus={(event) => event.currentTarget.select()}
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs"
          />
        </>
      ) : (
        <>
          <Input
            id={`invite-${memberId}`}
            name="email"
            type="email"
            label={`Email for ${memberName}`}
            required
          />
          {error && (
            <p role="alert" className="text-xs text-red-600">
              {getErrorMessage(error)}
            </p>
          )}
          <Button type="submit" size="sm" loading={isLoading}>
            Create invitation
          </Button>
        </>
      )}
    </form>
  );
};

export default InviteHolder;
