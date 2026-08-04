"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { currentAdmin, initialBuyers, initialDisputes, initialMarketplaceSettings } from "@/data/admin";
import { sellers } from "@/data/sellers";
import type { AdminAction, Buyer, BuyerStatus, Dispute, MarketplaceSettings, SellerStatus } from "@/types";

export interface AdminSellerRecord {
  sellerId: string;
  status: SellerStatus;
  verificationStatus: "Pending Verification" | "Verified" | "Rejected";
  lastActiveAt: string;
  restrictionReason?: string;
}

interface AdminState {
  version: 1;
  buyers: Buyer[];
  sellerRecords: AdminSellerRecord[];
  disputes: Dispute[];
  settings: MarketplaceSettings;
  auditLog: AdminAction[];
}

interface AdminContextValue extends AdminState {
  admin: typeof currentAdmin;
  recordAction: (action: Omit<AdminAction, "id" | "adminId" | "createdAt">) => void;
  updateBuyerStatus: (id: string, status: BuyerStatus, reason: string) => void;
  updateSellerStatus: (id: string, status: SellerStatus, reason: string) => void;
  updateDispute: (id: string, updates: Partial<Dispute>, reason: string) => void;
  updateSettings: (updates: Partial<MarketplaceSettings>) => void;
}

const initialSellerRecords: AdminSellerRecord[] = Object.values(sellers).map((seller) => ({ sellerId: seller.id, status: "Active", verificationStatus: seller.verified ? "Verified" : "Pending Verification", lastActiveAt: "2026-08-03T09:00:00.000Z" }));
const initialState: AdminState = { version: 1, buyers: initialBuyers, sellerRecords: initialSellerRecords, disputes: initialDisputes, settings: initialMarketplaceSettings, auditLog: [] };
const initialSnapshot = JSON.stringify(initialState);
const storageKey = "azizmarket-admin-workspace-v1";
const changeEvent = "azizmarket-admin-change";
const AdminContext = createContext<AdminContextValue | null>(null);

function subscribe(callback: () => void) { const onStorage = (event: StorageEvent) => { if (event.key === storageKey) callback(); }; window.addEventListener("storage", onStorage); window.addEventListener(changeEvent, callback); return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(changeEvent, callback); }; }
function getSnapshot() { return window.localStorage.getItem(storageKey) ?? initialSnapshot; }
function safeParse(snapshot: string): AdminState { try { const parsed: unknown = JSON.parse(snapshot); if (!parsed || typeof parsed !== "object") return initialState; const value = parsed as Partial<AdminState>; return { ...initialState, ...value, version: 1, buyers: Array.isArray(value.buyers) ? value.buyers : initialState.buyers, sellerRecords: Array.isArray(value.sellerRecords) ? value.sellerRecords : initialState.sellerRecords, disputes: Array.isArray(value.disputes) ? value.disputes : initialState.disputes, auditLog: Array.isArray(value.auditLog) ? value.auditLog : [] }; } catch { return initialState; } }
function save(state: AdminState) { window.localStorage.setItem(storageKey, JSON.stringify(state)); window.dispatchEvent(new Event(changeEvent)); }

export function AdminProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => initialSnapshot);
  const state = useMemo(() => safeParse(snapshot), [snapshot]);
  const recordAction = useCallback((action: Omit<AdminAction, "id" | "adminId" | "createdAt">) => save({ ...state, auditLog: [{ ...action, id: window.crypto.randomUUID(), adminId: currentAdmin.id, createdAt: new Date().toISOString() }, ...state.auditLog] }), [state]);
  const updateBuyerStatus = useCallback((id: string, status: BuyerStatus, reason: string) => { const previous = state.buyers.find((buyer) => buyer.id === id)?.status; const next = { ...state, buyers: state.buyers.map((buyer) => buyer.id === id ? { ...buyer, status } : buyer) }; next.auditLog = [{ id: window.crypto.randomUUID(), adminId: currentAdmin.id, actionType: `Buyer ${status}`, entityType: "buyer", entityId: id, reason, previousValue: previous, newValue: status, createdAt: new Date().toISOString() }, ...state.auditLog]; save(next); }, [state]);
  const updateSellerStatus = useCallback((id: string, status: SellerStatus, reason: string) => { const previous = state.sellerRecords.find((seller) => seller.sellerId === id)?.status; const next = { ...state, sellerRecords: state.sellerRecords.map((seller) => seller.sellerId === id ? { ...seller, status, verificationStatus: status === "Verified" || status === "Active" ? "Verified" as const : status === "Rejected" ? "Rejected" as const : seller.verificationStatus, restrictionReason: reason || seller.restrictionReason } : seller) }; next.auditLog = [{ id: window.crypto.randomUUID(), adminId: currentAdmin.id, actionType: `Seller ${status}`, entityType: "seller", entityId: id, reason, previousValue: previous, newValue: status, createdAt: new Date().toISOString() }, ...state.auditLog]; save(next); }, [state]);
  const updateDispute = useCallback((id: string, updates: Partial<Dispute>, reason: string) => { const dispute = state.disputes.find((item) => item.id === id); const status = updates.status ?? dispute?.status ?? "Open"; const now = new Date().toISOString(); const next = { ...state, disputes: state.disputes.map((item) => item.id === id ? { ...item, ...updates, id, updatedAt: now, history: [...item.history, { id: window.crypto.randomUUID(), status, description: reason, actor: currentAdmin.name, createdAt: now }] } : item) }; next.auditLog = [{ id: window.crypto.randomUUID(), adminId: currentAdmin.id, actionType: "Dispute update", entityType: "dispute", entityId: id, reason, previousValue: dispute?.status, newValue: status, createdAt: now }, ...state.auditLog]; save(next); }, [state]);
  const updateSettings = useCallback((updates: Partial<MarketplaceSettings>) => { const now = new Date().toISOString(); save({ ...state, settings: { ...state.settings, ...updates }, auditLog: [{ id: window.crypto.randomUUID(), adminId: currentAdmin.id, actionType: "Settings updated", entityType: "settings", entityId: "marketplace", reason: "Marketplace configuration updated", newValue: JSON.stringify(updates), createdAt: now }, ...state.auditLog] }); }, [state]);
  const value = useMemo(() => ({ ...state, admin: currentAdmin, recordAction, updateBuyerStatus, updateSellerStatus, updateDispute, updateSettings }), [state, recordAction, updateBuyerStatus, updateSellerStatus, updateDispute, updateSettings]);
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() { const context = useContext(AdminContext); if (!context) throw new Error("useAdmin must be used within AdminProvider"); return context; }
