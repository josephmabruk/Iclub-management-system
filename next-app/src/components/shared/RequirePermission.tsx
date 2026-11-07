"use client";

import Card from "@/components/ui/Card";
import { usePermissions } from "@/hooks/usePermissions";
import type { Permission } from "@/types";

type Props = { permission: Permission; children: React.ReactNode };

const RequirePermission = ({ permission, children }: Props) => {
  const { can } = usePermissions();
  if (can(permission)) return <>{children}</>;
  return (
    <Card title="You do not have access to this page">
      <p className="muted text-sm">
        Your office in this term does not include this area. Ask your club
        administrator if you think this is a mistake.
      </p>
    </Card>
  );
};

export default RequirePermission;
