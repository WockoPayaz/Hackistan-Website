const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "2-digit", timeZone: "UTC" });
export function formatWorkshopDate(iso: string): string {
  return dateFormatter.format(new Date(`${iso}T12:00:00Z`)).toUpperCase();
}
export function padNumber(number: number): string { return String(number).padStart(2, "0"); }
