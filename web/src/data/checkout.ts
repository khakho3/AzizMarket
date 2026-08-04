import type { DeliveryMethod } from "@/types";

export const ghanaLocations: Record<string, string[]> = {
  "Greater Accra": ["Accra", "Tema", "Madina", "Teshie"],
  Ashanti: ["Kumasi", "Obuasi", "Ejisu"],
  Central: ["Cape Coast", "Kasoa", "Winneba"],
  Western: ["Takoradi", "Tarkwa", "Axim"],
  Eastern: ["Koforidua", "Akosombo", "Aburi"],
  Northern: ["Tamale", "Yendi", "Savelugu"],
  Volta: ["Ho", "Hohoe", "Keta"],
  Bono: ["Sunyani", "Berekum", "Dormaa Ahenkro"],
};

export const deliveryMethods: DeliveryMethod[] = [
  {
    id: "standard",
    name: "Standard delivery",
    description: "Reliable doorstep delivery through our standard courier network.",
    estimatedPeriod: "2–5 business days",
    price: 35,
  },
  {
    id: "express",
    name: "Express delivery",
    description: "Priority dispatch for eligible destinations and in-stock products.",
    estimatedPeriod: "1–2 business days",
    price: 70,
  },
  {
    id: "pickup",
    name: "Pickup from seller",
    description: "Arrange a convenient collection time directly with each seller.",
    estimatedPeriod: "Usually ready within 24 hours",
    price: 0,
  },
];
