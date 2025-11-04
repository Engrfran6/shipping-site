"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, DollarSign, MapPin, Truck, Zap } from "lucide-react";
import Link from "next/link";

export default function ExpressDeliveryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* <Navbar /> */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center bg-orange-100 p-4 rounded-lg mb-6">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 text-balance">
                Express Delivery
              </h1>
              <p className="text-xl text-gray-600 text-pretty mb-8">
                Faster shipping when you need it. 2-3 business day delivery with
                priority handling and real-time updates for time-sensitive
                shipments.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Link href="#quote">Get a Quote</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Express Advantages
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>2-3 Business Days</CardTitle>
                  <CardDescription>Fast, reliable delivery</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Daily pickups available</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Priority route handling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                    <Zap className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Priority Processing</CardTitle>
                  <CardDescription>Skip the queue</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Expedited handling</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Dedicated support line</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Enhanced Tracking</CardTitle>
                  <CardDescription>Stay updated every minute</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Real-time GPS tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Instant notifications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Competitive Pricing</CardTitle>
                  <CardDescription>Good value for speed</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>No hidden fees</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Bulk discounts available</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Express Rates
            </h2>
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>2-3 Day Shipping Rates</CardTitle>
                <CardDescription>
                  Competitive pricing for faster service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Up to 5 lbs</span>
                    <span className="font-semibold">$12.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">5-20 lbs</span>
                    <span className="font-semibold">$18.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">20-50 lbs</span>
                    <span className="font-semibold">$24.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600">50+ lbs</span>
                    <span className="font-semibold">Custom Quote</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-orange-600 text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Need It Fast?</h2>
            <p className="text-lg mb-8 text-orange-100">
              Express Delivery gets your packages to their destination quickly
              and reliably.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-orange-600 hover:bg-orange-50"
            >
              <Link href="/auth/signup">Start Shipping</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
