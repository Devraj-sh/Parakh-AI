/**
 * Helper to get human-crafted solid badge styles for icon containers across the app.
 * Eliminates transparent washed-out `${color}15` styles and replaces them with
 * solid, high-contrast, tactile badges with crisp 1px borders and inner highlights.
 */
export function getSolidIconBadgeProps(color: string): {
  bg: string;
  border: string;
  text: string;
  className: string;
} {
  const c = (color || "").toLowerCase();

  if (c.includes("1769e0") || c.includes("2563eb") || c.includes("1d4ed8") || c.includes("blue")) {
    return { bg: "#EFF6FF", border: "#BFDBFE", text: "#1769E0", className: "badge-blue" };
  }
  if (c.includes("00b8d9") || c.includes("06b6d4") || c.includes("cyan")) {
    return { bg: "#ECFEFF", border: "#A5F3FC", text: "#0284C7", className: "badge-cyan" };
  }
  if (c.includes("16803c") || c.includes("16a34a") || c.includes("green") || c.includes("22c55e")) {
    return { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", className: "badge-green" };
  }
  if (c.includes("d97706") || c.includes("f59e0b") || c.includes("amber") || c.includes("c77c02")) {
    return { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", className: "badge-amber" };
  }
  if (c.includes("7b3fe4") || c.includes("8b5cf6") || c.includes("purple") || c.includes("violet")) {
    return { bg: "#F5F3FF", border: "#DDD6FE", text: "#6D28D9", className: "badge-purple" };
  }
  if (c.includes("2e5bff") || c.includes("4f46e5") || c.includes("indigo")) {
    return { bg: "#EEF2FF", border: "#C7D2FE", text: "#4338CA", className: "badge-indigo" };
  }
  if (c.includes("c62828") || c.includes("dc2626") || c.includes("ef4444") || c.includes("red")) {
    return { bg: "#FEF2F2", border: "#FECACA", text: "#B91C1C", className: "badge-red" };
  }

  return { bg: "#F1F5F9", border: "#CBD5E1", text: color, className: "badge-slate" };
}
