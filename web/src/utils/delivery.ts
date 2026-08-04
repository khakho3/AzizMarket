import type { CartItem } from "@/types";

function normalizePlace(value: string): string {
  return value
    .split(",")[0]
    .trim()
    .toLocaleLowerCase("en-GH")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isSellerNearBuyer(
  sellerLocation: string,
  buyerCity: string,
): boolean {
  if (!sellerLocation.trim() || !buyerCity.trim()) return false;
  return normalizePlace(sellerLocation) === normalizePlace(buyerCity);
}

export function areAllSellersNearBuyer(
  items: CartItem[],
  buyerCity: string,
): boolean {
  return (
    Boolean(buyerCity.trim()) &&
    items.length > 0 &&
    items.every((item) => isSellerNearBuyer(item.location, buyerCity))
  );
}
