"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, MapPin, Moon, Truck } from "lucide-react";
import Link from "next/link";

export default function OvernightPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-red-50 via-white to-rose-50">
      {/* <Navbar /> */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center bg-red-100 p-4 rounded-lg mb-6">
                <Moon className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 text-balance">
                Overnight Delivery
              </h1>
              <p className="text-xl text-gray-600 text-pretty mb-8">
                The fastest service available. Next business day morning
                delivery for urgent shipments. Signature required upon arrival.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Link href="#quote">Get Emergency Quote</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Overnight Service Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Next Business Morning</CardTitle>
                  <CardDescription>Guaranteed arrival</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Before 10:30 AM delivery</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Money-back guarantee</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Premium Handling</CardTitle>
                  <CardDescription>White glove service</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Signature required</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>24/7 tracking access</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                    <MapPin className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Live GPS Tracking</CardTitle>
                  <CardDescription>Every minute updates</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Real-time location</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Delivery time window</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                    <AlertCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Full Insurance</CardTitle>
                  <CardDescription>Complete coverage</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Up to $5,000 coverage</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>No deductible</span>
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
              Overnight Rates
            </h2>
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Next Business Morning Delivery</CardTitle>
                <CardDescription>Premium service pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Up to 5 lbs</span>
                    <span className="font-semibold">$29.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">5-20 lbs</span>
                    <span className="font-semibold">$39.99</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">20-50 lbs</span>
                    <span className="font-semibold">$49.99</span>
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
        <section className="py-16 px-4 bg-red-600 text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Emergency Shipping?</h2>
            <p className="text-lg mb-8 text-red-100">
              Get your package there by tomorrow morning. Fast, reliable,
              guaranteed.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-red-600 hover:bg-red-50"
            >
              <Link href="/auth/signup">Ship Overnight Now</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
