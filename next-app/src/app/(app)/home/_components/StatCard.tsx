import Card from "@/components/ui/Card";

type StatCardProps = { label: string; value: number; note: string };

const StatCard = ({ label, value, note }: StatCardProps) => {
  return (
    <Card>
      <p className="muted text-sm">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
      <p className="muted mt-1 text-xs">{note}</p>
    </Card>
  );
};

export default StatCard;