"use client";

import type { CategoryRequest } from "@/types";

export const categoryRequestStorageKey = "azizmarket-category-requests";
export const categoryRequestChangeEvent = "azizmarket-category-requests-change";
export function parseCategoryRequests(snapshot: string): CategoryRequest[] { try { const value: unknown = JSON.parse(snapshot); if (!Array.isArray(value)) return []; return value.filter((item) => Boolean(item && typeof item === "object" && typeof (item as Partial<CategoryRequest>).id === "string")).map((item) => { const request = item as Partial<CategoryRequest>; const rawStatus = String(request.status ?? "Pending").toLowerCase(); return { id: request.id ?? window.crypto.randomUUID(), sellerId: request.sellerId ?? "seller-004", suggestedName: request.suggestedName ?? "Untitled category", description: request.description ?? "", reason: request.reason ?? "", status: rawStatus === "approved" ? "Approved" as const : rawStatus === "rejected" ? "Rejected" as const : "Pending" as const, createdAt: request.createdAt ?? "2026-08-03T00:00:00.000Z", rejectionReason: request.rejectionReason }; }); } catch { return []; } }
export function getCategoryRequestSnapshot() { return window.localStorage.getItem(categoryRequestStorageKey) ?? "[]"; }
export function subscribeCategoryRequests(callback: () => void) { const onStorage = (event: StorageEvent) => { if (event.key === categoryRequestStorageKey) callback(); }; window.addEventListener("storage", onStorage); window.addEventListener(categoryRequestChangeEvent, callback); return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(categoryRequestChangeEvent, callback); }; }
export function saveCategoryRequests(requests: CategoryRequest[]) { window.localStorage.setItem(categoryRequestStorageKey, JSON.stringify(requests)); window.dispatchEvent(new Event(categoryRequestChangeEvent)); }
