import type { AdminUser, Buyer, Dispute, MarketplaceSettings } from "@/types";

export const currentAdmin: AdminUser = {
  id: "admin-001",
  name: "Hassan Abdul Aziz",
  email: "admin@azizmarket.com",
  role: "admin",
  initials: "HA",
  permissions: ["orders.view", "orders.manage", "products.review", "categories.manage", "sellers.manage", "buyers.manage", "payments.view", "payments.manage", "disputes.manage", "reports.view", "settings.manage"],
};

export const initialBuyers: Buyer[] = [
  { id: "buyer-001", name: "Hassan Abdul Aziz", email: "hassan@example.com", phone: "+233 24 000 0000", status: "Active", joinedAt: "2025-03-12", lastActiveAt: "2026-08-03T10:00:00.000Z" },
  { id: "buyer-002", name: "Ama Boateng", email: "ama@example.com", phone: "+233 20 555 0142", status: "Active", joinedAt: "2025-08-22", lastActiveAt: "2026-08-02T16:30:00.000Z" },
  { id: "buyer-003", name: "Kwesi Mensah", email: "kwesi@example.com", phone: "+233 54 555 0199", status: "Active", joinedAt: "2026-01-10", lastActiveAt: "2026-08-01T12:20:00.000Z" },
];

export const initialDisputes: Dispute[] = [
  { id: "DSP-2026-001", orderId: "ORD-2026-0002", buyerName: "Hassan Abdul Aziz", sellerId: "seller-005", sellerName: "Workspace Ghana", reason: "Delivery item condition requires review", amount: 1680, status: "Under Review", buyerStatement: "The delivered item has a visible mark that was not shown in the listing.", sellerStatement: "The item was inspected before dispatch. We are willing to review delivery evidence.", openedAt: "2026-07-29T11:00:00.000Z", updatedAt: "2026-08-02T14:15:00.000Z", history: [{ id: "history-001", status: "Open", description: "Buyer opened the dispute.", actor: "Buyer", createdAt: "2026-07-29T11:00:00.000Z" }, { id: "history-002", status: "Under Review", description: "Marketplace support began reviewing the case.", actor: "Admin", createdAt: "2026-08-02T14:15:00.000Z" }], adminNotes: [] },
];

export const initialMarketplaceSettings: MarketplaceSettings = {
  marketplaceName: "AzizMarket",
  supportEmail: "support@azizmarket.com",
  defaultCommissionPercentage: 10,
  categoryCommissionPercentages: {},
  sellerCommissionPercentages: {},
  autoApproveProducts: false,
  requireSellerVerification: true,
  orderCancellationHours: 24,
  paymentAgreements: ["Full Payment", "Partial Payment", "Pre-order", "Payment on Delivery"],
  standardDeliveryFee: 35,
  emailNotifications: true,
  maintenanceMode: false,
  termsPlaceholder: "Marketplace terms and policies will be connected to managed content later.",
};
