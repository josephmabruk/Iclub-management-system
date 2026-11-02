import { cn } from "@/lib/utils";

type Tone = "good" | "warn" | "bad" | "neutral";

const TONES: Record<Tone, { icon: string; classes: string }> = {
  good: { icon: "✓", classes: "bg-brand-100 text-brand-700" },
  warn: { icon: "⚠", classes: "bg-warn-50 text-amber-800" },
  bad: { icon: "✕", classes: "bg-danger-50 text-red-700" },
  neutral: { icon: "○", classes: "bg-gray-100 text-gray-600" },
};

const StatusChip = ({ label, tone }: { label: string; tone: Tone }) => {
  const { icon, classes } = TONES[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        classes,
      )}
    >
      <span aria-hidden="true">{icon}</span>
      {label}
    </span>
  );
};

export default StatusChip;
