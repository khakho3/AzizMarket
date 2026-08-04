import { sellers } from "@/data/sellers";
import type { Conversation, Store } from "@/types";

export const currentSeller = {
  ...sellers.nayaThreads,
  ownerName: "Hassan Abdul Aziz",
  email: "seller@azizmarket.com",
  phone: "+233 24 555 0198",
  logo: "/products/fashion.svg",
  banner: "/products/detail-green.svg",
  status: "Active" as const,
};

export const initialStore: Store = {
  sellerId: currentSeller.id,
  storeName: currentSeller.storeName,
  logo: currentSeller.logo,
  banner: currentSeller.banner,
  description: currentSeller.description,
  phone: currentSeller.phone,
  email: currentSeller.email,
  region: "Central Region",
  city: "Cape Coast",
  address: "Kotokraba Road, Cape Coast",
  deliveryInformation: "Delivery within Cape Coast in 1 day and nationwide in 2–4 business days.",
  businessHours: "Monday–Saturday, 8:30 AM–6:00 PM",
  returnPolicy: "Unused products may be returned within 7 days in their original condition.",
  status: "Active",
};

export const initialConversations: Conversation[] = [
  {
    id: "conversation-001",
    buyerName: "Ama Boateng",
    buyerInitials: "AB",
    productId: "prod-007",
    productName: "Handwoven Kente Accent Jacket",
    productImage: "/products/fashion.svg",
    sellerId: currentSeller.id,
    unreadCount: 2,
    updatedAt: "2026-08-03T09:40:00.000Z",
    messages: [
      { id: "message-001", sender: "buyer", text: "Hello, is this jacket still available in medium?", createdAt: "2026-08-03T09:36:00.000Z" },
      { id: "message-002", sender: "seller", text: "Yes, medium is available and ready for delivery.", createdAt: "2026-08-03T09:38:00.000Z" },
      { id: "message-003", sender: "buyer", text: "Great. Can you deliver to East Legon?", createdAt: "2026-08-03T09:40:00.000Z" },
    ],
  },
  {
    id: "conversation-002",
    buyerName: "Kwesi Mensah",
    buyerInitials: "KM",
    productId: "prod-008",
    productName: "Leather Court Sneakers",
    productImage: "/products/fashion.svg",
    sellerId: currentSeller.id,
    unreadCount: 0,
    updatedAt: "2026-08-02T16:15:00.000Z",
    messages: [
      { id: "message-004", sender: "buyer", text: "Do these fit true to size?", createdAt: "2026-08-02T16:10:00.000Z" },
      { id: "message-005", sender: "seller", text: "Yes, choose your usual UK size.", createdAt: "2026-08-02T16:15:00.000Z" },
    ],
  },
];
