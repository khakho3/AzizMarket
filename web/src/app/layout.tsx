import type { Metadata } from "next";
import { AuthProvider } from "@/context/auth-context";
import { CartProvider } from "@/context/cart-context";
import { CategoryProvider } from "@/context/category-context";
import { ProductProvider } from "@/context/product-context";
import { SellerProvider } from "@/context/seller-context";
import { AdminProvider } from "@/context/admin-context";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "AzizMarket",
  title: {
    default: "AzizMarket | Buy Better. Sell Further.",
    template: "%s | AzizMarket",
  },
  description:
    "AzizMarket connects buyers with trusted sellers across Ghana. Discover quality products, flexible payments and local businesses.",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-white text-slate-900 antialiased">
        <AuthProvider>
          <CategoryProvider>
            <ProductProvider>
              <AdminProvider>
                <SellerProvider>
                  <CartProvider>{children}</CartProvider>
                </SellerProvider>
              </AdminProvider>
            </ProductProvider>
          </CategoryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
