import type { Category } from "@/types";

const createdAt = "2026-01-01";

export const categories: Category[] = [
  { id: "phones-and-tablets", name: "Phones and Tablets", slug: "phones-and-tablets", description: "Smartphones, tablets and mobile accessories", image: "/products/phones-and-tablets.svg", isActive: true, createdAt },
  { id: "computers", name: "Computers", slug: "computers", description: "Laptops, desktops and computer accessories", image: "/products/computers.svg", isActive: true, createdAt },
  { id: "electronics", name: "Electronics", slug: "electronics", description: "Audio, television and everyday technology", image: "/products/electronics.svg", isActive: true, createdAt },
  { id: "fashion", name: "Fashion", slug: "fashion", description: "Clothing, footwear and accessories", image: "/products/fashion.svg", isActive: true, createdAt },
  { id: "furniture", name: "Furniture", slug: "furniture", description: "Furniture for home, office and outdoor spaces", image: "/products/furniture.svg", isActive: true, createdAt },
  { id: "home-appliances", name: "Home Appliances", slug: "home-appliances", description: "Kitchen and household appliances", image: "/products/home-appliances.svg", isActive: true, createdAt },
  { id: "beauty", name: "Beauty", slug: "beauty", description: "Skincare, haircare and personal wellness", image: "/products/beauty.svg", isActive: true, createdAt },
  { id: "food", name: "Food", slug: "food", description: "Fresh food, groceries and local produce", image: "/products/food.svg", isActive: true, createdAt },
  { id: "vehicles", name: "Vehicles", slug: "vehicles", description: "Cars, motorcycles and vehicle accessories", image: "/products/vehicles.svg", isActive: true, createdAt },
  { id: "services", name: "Services", slug: "services", description: "Trusted professional and household services", image: "/products/services.svg", isActive: true, createdAt },
  { id: "smartphones", name: "Smartphones", slug: "smartphones", description: "Android phones and iPhones", image: "/products/phones-and-tablets.svg", isActive: true, parentCategoryId: "phones-and-tablets", createdAt },
  { id: "tablets", name: "Tablets", slug: "tablets", description: "Portable tablets and accessories", image: "/products/phones-and-tablets.svg", isActive: true, parentCategoryId: "phones-and-tablets", createdAt },
  { id: "laptops", name: "Laptops", slug: "laptops", description: "Portable computers for work and study", image: "/products/computers.svg", isActive: true, parentCategoryId: "computers", createdAt },
  { id: "desktops", name: "Desktop Computers", slug: "desktops", description: "Desktop computers and workstations", image: "/products/computers.svg", isActive: true, parentCategoryId: "computers", createdAt },
  { id: "audio", name: "Audio", slug: "audio", description: "Speakers, headphones and sound equipment", image: "/products/electronics.svg", isActive: true, parentCategoryId: "electronics", createdAt },
  { id: "tv-video", name: "TV and Video", slug: "tv-video", description: "Televisions and video equipment", image: "/products/electronics.svg", isActive: true, parentCategoryId: "electronics", createdAt },
  { id: "clothing", name: "Clothing", slug: "clothing", description: "Clothes for every occasion", image: "/products/fashion.svg", isActive: true, parentCategoryId: "fashion", createdAt },
  { id: "footwear", name: "Footwear", slug: "footwear", description: "Shoes, sandals and trainers", image: "/products/fashion.svg", isActive: true, parentCategoryId: "fashion", createdAt },
  { id: "office-furniture", name: "Office Furniture", slug: "office-furniture", description: "Desks, chairs and office storage", image: "/products/furniture.svg", isActive: true, parentCategoryId: "furniture", createdAt },
  { id: "living-room", name: "Living Room", slug: "living-room", description: "Sofas, tables and living room pieces", image: "/products/furniture.svg", isActive: true, parentCategoryId: "furniture", createdAt },
  { id: "kitchen-appliances", name: "Kitchen Appliances", slug: "kitchen-appliances", description: "Appliances for cooking and food preparation", image: "/products/home-appliances.svg", isActive: true, parentCategoryId: "home-appliances", createdAt },
  { id: "household-appliances", name: "Household Appliances", slug: "household-appliances", description: "Practical appliances for the home", image: "/products/home-appliances.svg", isActive: true, parentCategoryId: "home-appliances", createdAt },
  { id: "skincare", name: "Skincare", slug: "skincare", description: "Skincare essentials and treatments", image: "/products/beauty.svg", isActive: true, parentCategoryId: "beauty", createdAt },
  { id: "haircare", name: "Haircare", slug: "haircare", description: "Hair products and styling essentials", image: "/products/beauty.svg", isActive: true, parentCategoryId: "beauty", createdAt },
  { id: "beverages", name: "Beverages", slug: "beverages", description: "Drinks and locally produced beverages", image: "/products/food.svg", isActive: true, parentCategoryId: "food", createdAt },
  { id: "groceries", name: "Groceries", slug: "groceries", description: "Everyday food and pantry items", image: "/products/food.svg", isActive: true, parentCategoryId: "food", createdAt },
  { id: "cars", name: "Cars", slug: "cars", description: "New and used cars", image: "/products/vehicles.svg", isActive: true, parentCategoryId: "vehicles", createdAt },
  { id: "motorcycles", name: "Motorcycles", slug: "motorcycles", description: "Motorcycles and riding accessories", image: "/products/vehicles.svg", isActive: true, parentCategoryId: "vehicles", createdAt },
  { id: "home-services", name: "Home Services", slug: "home-services", description: "Repairs, cleaning and household help", image: "/products/services.svg", isActive: true, parentCategoryId: "services", createdAt },
  { id: "business-services", name: "Business Services", slug: "business-services", description: "Professional services for businesses", image: "/products/services.svg", isActive: true, parentCategoryId: "services", createdAt },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((category) => category.id === id);
}

export function getMainCategories(source = categories): Category[] {
  return source.filter((category) => !category.parentCategoryId);
}

export function getSubcategories(parentCategoryId: string, source = categories): Category[] {
  return source.filter((category) => category.parentCategoryId === parentCategoryId);
}
