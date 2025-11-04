"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Slider from "react-slick";

const backgroundImages = [
  "/hero-shipping-img.webp",
  "/shipping-img2.webp",
  "/shipping-img3.webp",
  "/shipping-img4.webp",
];

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 1000,
  autoplay: true,
  autoplaySpeed: 5000,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: false,
  fade: true,
  pauseOnHover: false,
};

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden flex items-center justify-center px-4 pb-40">
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Slider {...sliderSettings}>
          {backgroundImages.map((src, index) => (
            <div key={index} className="relative w-full h-screen">
              <Image
                src={src}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </Slider>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center container mx-auto">
        <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-100">
          Trusted by 10,000+ businesses
        </Badge>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
          Ship Smarter,<span className="text-blue-400"> Deliver Faster</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto text-pretty">
          Professional shipping solutions for businesses of all sizes. Track
          packages in real-time, get instant quotes, and manage your logistics
          with ease.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href="/quote">
              Get Instant Quote <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-gray-300 text-white hover:bg-white/10 bg-transparent"
          >
            <Link href="/track">Track Shipment</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
