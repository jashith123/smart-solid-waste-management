// Central design tokens for the app. Keep colors/spacing here so screens stay consistent.

export const colors = {
  primary: "#16A34A",
  primaryDark: "#15803D",
  primarySoft: "#DCFCE7",

  background: "#F2F7F4",
  card: "#FFFFFF",
  border: "#E2E8F0",

  text: "#0F172A",
  textMuted: "#64748B",
  textOnPrimary: "#FFFFFF",

  danger: "#EF4444",
  dangerSoft: "#FEE2E2",
  white: "#FFFFFF",

  // Report status palette
  pending: "#F59E0B",
  pendingSoft: "#FEF3C7",
  inProgress: "#3B82F6",
  inProgressSoft: "#DBEAFE",
  resolved: "#16A34A",
  resolvedSoft: "#DCFCE7",
  rejected: "#EF4444",
  rejectedSoft: "#FEE2E2",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

export const shadow = {
  card: {
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
};

export type StatusKey =
  | "PENDING"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED";

export function statusStyle(status: string) {
  switch (status) {
    case "RESOLVED":
      return {
        fg: colors.resolved,
        bg: colors.resolvedSoft,
        label: "Resolved",
        icon: "checkmark-circle" as const,
      };
    case "IN_PROGRESS":
      return {
        fg: colors.inProgress,
        bg: colors.inProgressSoft,
        label: "In Progress",
        icon: "sync-circle" as const,
      };
    case "REJECTED":
      return {
        fg: colors.rejected,
        bg: colors.rejectedSoft,
        label: "Rejected",
        icon: "close-circle" as const,
      };
    default:
      return {
        fg: colors.pending,
        bg: colors.pendingSoft,
        label: "Pending",
        icon: "time" as const,
      };
  }
}

// Maps a 0..1 model confidence to a color + label band.
export function confidenceStyle(value: number) {
  const pct = Math.round(value * 100);
  if (value >= 0.7) {
    return { fg: colors.resolved, bg: colors.resolvedSoft, label: "High", pct };
  }
  if (value >= 0.4) {
    return { fg: colors.pending, bg: colors.pendingSoft, label: "Medium", pct };
  }
  return { fg: colors.danger, bg: colors.dangerSoft, label: "Low", pct };
}
