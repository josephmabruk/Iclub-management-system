import Link from "next/link";
import AppLogo from "@/components/shared/AppLogo";
import { ROUTES } from "@/constants";


/** Shared layout for ONLY login and signup: logo, the page's card, and a way back. */
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      {/* Left: dark brand panel, hidden on small screens */}
      <aside className="hidden bg-sidebar p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* TODO: logo at the top */}
        {/* TODO: headline "Good records. Stronger committees." and the paragraph under it */}
        {/* TODO: small line at the bottom: STUDENT CLUB COMMITTEE RECORDS */}
      </aside>

      {/* Right: the page itself (login or register) */}
      <section className="flex items-center justify-center bg-page px-6 py-12">
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;