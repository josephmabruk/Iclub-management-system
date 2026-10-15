"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/constants";
import { getErrorMessage } from "@/lib/utils";
import { useSignupMutation } from "@/store/api/authApi";
import { useState } from "react";

const SignupForm = () => {
  /**VARIABLES */
  const router = useRouter();
  const [signup, { isLoading, error }] = useSignupMutation();
  const [confirmError, setConfirmError] = useState("");

  /**FUNCTIONS */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    const password = String(form.get("password"));
    const confirm = String(form.get("confirm"));

    if (password !== confirm) {
      setConfirmError("Passwords do not match");
      return;
    }
    setConfirmError("");

    const result = await signup({
      name: String(form.get("name")),
      email: String(form.get("email")),
      password: password,
    });

    if (!result.error) router.push(ROUTES.dashboard);
  };

  /**COMPONENT */
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <Input
        id="signup-name"
        name="name"
        label="Name"
        autoComplete="name"
        required
      />
      <Input
        id="signup-email"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
      />
      <Input
        id="signup-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        hint="At least 10 characters"
        minLength={10}
        required
      />

      <Input
        id="signup-confirm"
        error={confirmError}
        name="confirm"
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        minLength={10}
        required
      />

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {getErrorMessage(error)}
        </p>
      )}

      <Button type="submit" block loading={isLoading}>
        Create account
      </Button>
    </form>
  );
};

export default SignupForm;
