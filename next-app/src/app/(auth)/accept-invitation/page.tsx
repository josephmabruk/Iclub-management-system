import type { Metadata } from "next";
import { Suspense } from "react";
import AcceptInvitationForm from "../_components/AcceptInvitationForm";

export const metadata: Metadata = { title: "Accept invitation" };

const AcceptInvitationPage = () => {
  return (
    <Suspense fallback={null}>
      <AcceptInvitationForm />
    </Suspense>
  );
};

export default AcceptInvitationPage;
