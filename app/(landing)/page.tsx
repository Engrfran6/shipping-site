import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import HeroSection from "@/components/landing/HeroSection";
import Services from "@/components/landing/Services";
import Stats from "@/components/landing/Stats";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <HeroSection />

      {/* Features Section */}
      <Features />

      {/* Services Section */}
      <Services />

      {/* Stats Section */}
      <Stats />

      {/* CTA Section */}
      <CTA />
    </div>
  );
}
