import { MEMBER_STATUS_LABELS } from "@/constants";
import { cn } from "@/lib/utils";
import type { MemberStatus } from "@/types";

const LOOK: Record<MemberStatus, { icon: string; classes: string }> = {
  active: { icon: "✓", classes: "bg-brand-100 text-brand-700" },
  departing: { icon: "⚠", classes: "bg-warn-50 text-amber-800" },
  inactive: { icon: "○", classes: "bg-gray-100 text-gray-600" },
};

const MemberStatusChip = ({ status }: { status: MemberStatus }) => {
  const { icon, classes } = LOOK[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        classes,
      )}
    >
      <span aria-hidden="true">{icon}</span>
      {MEMBER_STATUS_LABELS[status]}
    </span>
  );
};

export default MemberStatusChip;
