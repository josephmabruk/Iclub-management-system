"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AppLogo from "@/components/shared/AppLogo";
import { APP_NAV, ROUTES } from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSidebarOpen } from "@/store/selectors";
import { closeSidebar } from "@/store/slices/uiSlice";

const ITEM = "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm";

const Sidebar = () => {
  /**VARIABLES */
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectSidebarOpen);
  const { user } = useAuth();
  const club = user?.club;

  /**FUNCTIONS */
  const close = () => dispatch(closeSidebar());

  /**COMPONENT */
  return (
    <>
      {isOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={close}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 -translate-x-full flex-col bg-sidebar text-white transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
          isOpen && "translate-x-0",
        )}
      >
        <div className="px-5 pt-5">
          <Link
            href={ROUTES.home}
            onClick={close}
            className="inline-block rounded-lg bg-white px-3 py-1.5"
          >
            <AppLogo />
          </Link>
        </div>

        <div className="mx-5 mt-5 border-b border-white/10 pb-5">
          <p className="text-base leading-snug font-semibold">
            {club?.name ?? "Your club"}
          </p>
          {/* Stand-in until appointments exist: the registering user is the administrator. */}
          <p className="mt-1 text-sm text-brand-200">Administrator</p>
          {club?.term && (
            <p className="text-sm text-white/60">Term {club.term.name}</p>
          )}
        </div>

        <nav
          aria-label="App"
          className="flex flex-1 flex-col gap-1 overflow-y-auto p-4"
        >
          {APP_NAV.map((link) =>
            link.ready ? (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                className={cn(
                  ITEM,
                  pathname.startsWith(link.href)
                    ? "bg-brand-600 font-semibold"
                    : "text-white/80 hover:bg-white/10",
                )}
              >
                {link.label}
              </Link>
            ) : (
              <div
                key={link.href}
                aria-disabled="true"
                className={cn(ITEM, "cursor-not-allowed text-white/40")}
              >
                <span>{link.label}</span>
                <span className="text-xs">Coming next</span>
              </div>
            ),
          )}
        </nav>

        <p className="px-5 pb-5 text-xs leading-relaxed text-white/50">
          Built for continuity.
          <br />
          Made for your committee.
        </p>
      </aside>
    </>
  );
};

export default Sidebar;
