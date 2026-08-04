export function formatAdminSellerDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not available";
  return new Intl.DateTimeFormat("en-GH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function displayAdminSellerValue(
  value: string | null | undefined,
): string {
  return value?.trim() || "Not provided";
}
