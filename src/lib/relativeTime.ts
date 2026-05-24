export function relativeTimeId(dateInput: string | Date): string {
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  const diff = (Date.now() - date.getTime()) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} hari lalu`;
  if (diff < 86400 * 30) return `${Math.floor(diff / (86400 * 7))} minggu lalu`;
  if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))} bulan lalu`;
  return `${Math.floor(diff / (86400 * 365))} tahun lalu`;
}
