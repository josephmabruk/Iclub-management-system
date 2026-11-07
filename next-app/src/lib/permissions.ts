import { PERMISSIONS } from "@/constants";
import type { AccessLevel, Permission } from "@/types";

/** PROVISIONAL: the team must approve this table. */
export const LEVEL_PERMISSIONS: Record<AccessLevel, readonly Permission[]> = {
  administrator: PERMISSIONS,
  treasurer: ["finance.view", "finance.post"],
  officeholder: ["activities.manage", "attendance.record", "records.manage"],
  patron: ["finance.view"],
};
