import { CategorySection } from "@/components/marketplace/category-section";
import { FeaturedProducts } from "@/components/marketplace/featured-products";
import { HeroSection } from "@/components/marketplace/hero-section";
import { SellerCallout } from "@/components/marketplace/seller-callout";
import { TrustStrip } from "@/components/marketplace/trust-strip";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <CategorySection />
      <FeaturedProducts />
      <SellerCallout />
    </>
  );
}
