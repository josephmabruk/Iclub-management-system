"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StateLoading from "@/components/ui/StateLoading";
import { PASSWORD_MIN_LENGTH, ROUTES } from "@/constants";
import { getErrorMessage } from "@/lib/utils";
import {
  useAcceptInvitationMutation,
  useGetInvitationInfoQuery,
} from "@/store/api/authApi";

const AcceptInvitationForm = () => {
  /**VARIABLES */
  const router = useRouter();
  const token = useSearchParams().get("token") ?? "";
  const {
    data: info,
    isLoading,
    isError,
  } = useGetInvitationInfoQuery(token, { skip: !token });
  const [accept, { isLoading: saving, error }] = useAcceptInvitationMutation();
  const [confirmError, setConfirmError] = useState("");

  /**FUNCTIONS */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    if (password !== String(form.get("confirm"))) {
      setConfirmError("Passwords do not match");
      return;
    }
    setConfirmError("");
    const result = await accept({ token, password });
    if (!result.error) router.push(ROUTES.home);
  };

  /**COMPONENT */
  if (isLoading) return <StateLoading label="Checking your invitation..." />;
  if (!token || isError || !info) {
    return (
      <Card className="w-full max-w-md" title="This invitation is not valid">
        <p className="muted text-sm">
          It may have expired or already been used. Ask your club administrator
          for a new one.
        </p>
      </Card>
    );
  }

  return (
    <Card
      className="w-full max-w-md"
      header={
        <div>
          <h1 className="text-lg font-semibold">Join {info.clubName}</h1>
          <p className="muted text-sm">
            Create a password for {info.memberName} ({info.email}).
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <Input
          id="invite-password"
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          hint={`At least ${PASSWORD_MIN_LENGTH} characters`}
          minLength={PASSWORD_MIN_LENGTH}
          required
        />
        <Input
          id="invite-confirm"
          name="confirm"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={confirmError}
          required
        />
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {getErrorMessage(error)}
          </p>
        )}
        <Button type="submit" block loading={saving}>
          Create my account
        </Button>
      </form>
    </Card>
  );
};

export default AcceptInvitationForm;
