"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Link from "next/link";

export default function StandardShippingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* <Navbar /> */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center bg-blue-100 p-4 rounded-lg mb-6">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 text-balance">
                Standard Shipping
              </h1>
              <p className="text-xl text-gray-600 text-pretty mb-8">
                Reliable, cost-effective shipping for shipments that don't need
                to arrive immediately. Perfect for routine business deliveries
                and non-urgent packages.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
              What's Included
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>5-7 Business Days</CardTitle>
                  <CardDescription>Flexible delivery timeline</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Domestic and regional delivery</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Multiple pickups per week</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Best Value</CardTitle>
                  <CardDescription>Most economical option</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Lowest shipping rates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Volume discounts available</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Real-Time Tracking</CardTitle>
                  <CardDescription>Monitor every step</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Live package updates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Email and SMS notifications</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                    <Truck className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Reliable Delivery</CardTitle>
                  <CardDescription>Safe handling guaranteed</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Insurance coverage included</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Professional handling</span>
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
              Simple, Transparent Pricing
            </h2>
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Shipping Rates</CardTitle>
                <CardDescription>
                  Prices vary based on weight and distance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Up to 5 lbs, Local</span>
                    <span className="font-semibold">$5.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">5-20 lbs, Regional</span>
                    <span className="font-semibold">$9.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">20-50 lbs, Regional</span>
                    <span className="font-semibold">$14.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-gray-600">50+ lbs, Regional</span>
                    <span className="font-semibold">Custom Quote</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Ship?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Get started with Standard Shipping today and enjoy reliable,
              affordable delivery.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Link href="/auth/signup">Create Account</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
