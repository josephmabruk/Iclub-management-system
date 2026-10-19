import Link from "next/link";
import AppLogo from "@/components/shared/AppLogo";
import { ROUTES } from "@/constants";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="grid flex-1 lg:grid-cols-2">
      <aside className="hidden bg-sidebar p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <AppLogo size="lg" />

        <div className="max-w-md">
          <p className="text-4xl leading-tight font-semibold">
            Good records. Stronger committees.
          </p>
          <p className="mt-6 text-lg text-white/70">
            A clear, shared record of your club&apos;s members, activities and
            committee handovers.
          </p>
          <div className="mt-8 h-0.5 w-12 bg-brand-200" />
          <p className="mt-6 text-sm text-white/70">
            Keep the work moving, from one term to the next.
          </p>
        </div>

        <p className="text-xs tracking-wide text-white/60 uppercase">
          Student club committee records
        </p>
      </aside>

      <section className="flex items-center justify-center bg-page px-6 py-12">
        {children}
      </section>
    </main>
  );
};

export default AuthLayout;
