"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { currentSeller, initialConversations, initialStore } from "@/data/current-seller";
import type { Conversation, Store, Withdrawal } from "@/types";

interface SellerWorkspaceState {
  store: Store;
  conversations: Conversation[];
  withdrawals: Withdrawal[];
  settings: { emailNotifications: boolean; orderNotifications: boolean; messageNotifications: boolean; profileVisible: boolean; preferredPayment: "Mobile Money" | "Bank Transfer" };
}

interface SellerContextValue extends SellerWorkspaceState {
  seller: typeof currentSeller;
  updateStore: (updates: Partial<Store>) => void;
  sendMessage: (conversationId: string, text: string) => void;
  markConversationRead: (conversationId: string) => void;
  addWithdrawal: (withdrawal: Withdrawal) => void;
  updateWithdrawal: (id: string, updates: Partial<Withdrawal>) => void;
  updateSettings: (updates: Partial<SellerWorkspaceState["settings"]>) => void;
}

const storageKey = "azizmarket-seller-workspace";
const changeEvent = "azizmarket-seller-workspace-change";
const initialState: SellerWorkspaceState = {
  store: initialStore,
  conversations: initialConversations,
  withdrawals: [{ id: "withdrawal-demo-001", amount: 950, method: "Mobile Money", accountLabel: "Demo payout account", status: "Pending", createdAt: "2026-08-02T11:00:00.000Z" }],
  settings: { emailNotifications: true, orderNotifications: true, messageNotifications: true, profileVisible: true, preferredPayment: "Mobile Money" },
};
const initialSnapshot = JSON.stringify(initialState);
const SellerContext = createContext<SellerContextValue | null>(null);

function subscribe(callback: () => void) {
  const onStorage = (event: StorageEvent) => { if (event.key === storageKey) callback(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener(changeEvent, callback);
  return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(changeEvent, callback); };
}

function getSnapshot() { return window.localStorage.getItem(storageKey) ?? initialSnapshot; }
function parse(snapshot: string): SellerWorkspaceState {
  try { return { ...initialState, ...(JSON.parse(snapshot) as Partial<SellerWorkspaceState>) }; } catch { return initialState; }
}
function save(state: SellerWorkspaceState) { window.localStorage.setItem(storageKey, JSON.stringify(state)); window.dispatchEvent(new Event(changeEvent)); }

export function SellerProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, () => initialSnapshot);
  const state = useMemo(() => parse(snapshot), [snapshot]);
  const updateStore = useCallback((updates: Partial<Store>) => save({ ...state, store: { ...state.store, ...updates } }), [state]);
  const sendMessage = useCallback((conversationId: string, text: string) => save({ ...state, conversations: state.conversations.map((conversation) => conversation.id === conversationId ? { ...conversation, updatedAt: new Date().toISOString(), messages: [...conversation.messages, { id: window.crypto.randomUUID(), sender: "seller" as const, text, createdAt: new Date().toISOString() }] } : conversation) }), [state]);
  const markConversationRead = useCallback((conversationId: string) => save({ ...state, conversations: state.conversations.map((conversation) => conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation) }), [state]);
  const addWithdrawal = useCallback((withdrawal: Withdrawal) => save({ ...state, withdrawals: [withdrawal, ...state.withdrawals] }), [state]);
  const updateWithdrawal = useCallback((id: string, updates: Partial<Withdrawal>) => save({ ...state, withdrawals: state.withdrawals.map((withdrawal) => withdrawal.id === id ? { ...withdrawal, ...updates, id } : withdrawal) }), [state]);
  const updateSettings = useCallback((updates: Partial<SellerWorkspaceState["settings"]>) => save({ ...state, settings: { ...state.settings, ...updates } }), [state]);
  const value = useMemo(() => ({ ...state, seller: currentSeller, updateStore, sendMessage, markConversationRead, addWithdrawal, updateWithdrawal, updateSettings }), [state, updateStore, sendMessage, markConversationRead, addWithdrawal, updateWithdrawal, updateSettings]);
  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

export function useSeller() { const context = useContext(SellerContext); if (!context) throw new Error("useSeller must be used within SellerProvider"); return context; }
