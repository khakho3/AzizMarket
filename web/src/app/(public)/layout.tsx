import type { ReactNode } from "react";
import { SplashScreen } from "@/components/common/splash-screen";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SplashScreen />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
