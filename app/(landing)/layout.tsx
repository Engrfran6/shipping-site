import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SwiftShip - Fast & Reliable Shipping Solutions",
  description: "landing page",
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
