"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import StateLoading from "@/components/ui/StateLoading";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  children: React.ReactNode;
  /** "app" needs finished setup. "setup" needs unfinished setup. */
  area: "app" | "setup";
};

const AuthGuard = ({ children, area }: Props) => {
  /**VARIABLES */
  const router = useRouter();
  const { user, isError } = useAuth();
  const setupDone = user?.club?.setupStatus === "complete";

  let redirectTo: string | null = null;
  if (isError) redirectTo = ROUTES.login;
  else if (user && area === "app" && !setupDone) redirectTo = ROUTES.setup;
  else if (user && area === "setup" && setupDone) redirectTo = ROUTES.home;

  useEffect(() => {
    if (redirectTo) router.replace(redirectTo);
  }, [redirectTo, router]);

  /**COMPONENT */
  if (!user || redirectTo) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <StateLoading label="Checking your session..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
