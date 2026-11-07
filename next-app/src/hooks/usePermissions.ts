import { useAuth } from "@/hooks/useAuth";
import type { Permission } from "@/types";

export const usePermissions = () => {
  const { user } = useAuth();
  const granted = user?.permissions ?? [];
  return {
    can: (permission: Permission) => granted.includes(permission),
    offices: user?.offices ?? [],
  };
};
