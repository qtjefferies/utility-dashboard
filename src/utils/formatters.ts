export function fmtMoney(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

export function getActivityDotColor(type: string): string {
  if (type === "income") return "bg-emerald-400";
  if (type === "tax_transfer") return "bg-blue-400";
  return "bg-amber-400";
}

export function getStatusColor(status: string): string {
  if (status === "active") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  if (status === "pending") return "bg-amber-500/10 text-amber-300 border-amber-500/30";
  return "bg-neutral-500/10 text-neutral-300 border-neutral-500/30";
}

export function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
