"use client";

import { usePathname } from "next/navigation";
import { SETUP_STEPS } from "@/constants";
import { cn } from "@/lib/utils";

const SetupStepper = () => {
  /**VARIABLES */
  const pathname = usePathname();
  const currentIndex = SETUP_STEPS.findIndex((step) =>
    pathname.startsWith(step.href),
  );

  /**COMPONENT */
  return (
    <ol className="mb-8 flex flex-wrap gap-x-8 gap-y-3 rounded-xl border border-gray-200 bg-white p-5">
      {SETUP_STEPS.map((step, index) => {
        const isCurrent = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <li key={step.key} className="flex items-center gap-3">
            <span
              className={cn(
                // TODO: three looks: current, done, and upcoming
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                isCurrent && "bg-brand-600 text-white",
                isDone && "bg-brand-100 text-brand-700",
                !isCurrent && !isDone && "bg-gray-100 text-gray-500",
              )}
            >
              {isDone ? "✓" : index + 1}
            </span>
            <span
              className={cn(
                "text-sm",
                // TODO: the current step's label should be bold and dark
                isCurrent ? "font-semibold text-ink" : "text-gray-500",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
};

export default SetupStepper;
