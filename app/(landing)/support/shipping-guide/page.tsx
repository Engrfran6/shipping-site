"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle, Package, Truck } from "lucide-react";
import Link from "next/link";

export default function ShippingGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* <Navbar /> */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 text-balance">
                Shipping Guide
              </h1>
              <p className="text-xl text-gray-600 text-pretty">
                Learn everything you need to know about shipping with SwiftShip,
                from packaging to delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl space-y-12">
            {/* Preparing Your Shipment */}
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>Preparing Your Shipment</CardTitle>
                    <CardDescription>
                      Follow these steps for optimal delivery
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Packaging Tips
                  </h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Use proper packaging materials to protect your items
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>
                        Fill empty spaces with bubble wrap or packing peanuts
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Seal boxes securely with quality tape</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>Label items clearly on one side</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Creating a Shipment */}
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Creating a Shipment</CardTitle>
                    <CardDescription>Step-by-step instructions</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Create an Account
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Sign up at SwiftShip to get started
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Enter Shipment Details
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Provide sender, recipient, and package information
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Select Service
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Choose from Standard, Express, Overnight, or
                        International
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      4
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Review & Pay
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Confirm details and complete payment
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                      5
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Print & Ship
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Print the label and arrange pickup or drop-off
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Restricted Items */}
            <Card className="border-gray-200 border-red-200 bg-red-50">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-3 rounded-lg">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <CardTitle className="text-red-900">
                      Prohibited Items
                    </CardTitle>
                    <CardDescription>Items we cannot ship</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-red-900 mb-4">
                  The following items cannot be shipped:
                </p>
                <ul className="grid md:grid-cols-2 gap-3 text-red-900">
                  <li>Hazardous materials</li>
                  <li>Flammable substances</li>
                  <li>Weapons or explosives</li>
                  <li>Perishables (without special handling)</li>
                  <li>Live animals</li>
                  <li>Recalled items</li>
                </ul>
              </CardContent>
            </Card>

            {/* Tracking Your Package */}
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle>Tracking Your Package</CardTitle>
                <CardDescription>How to monitor your shipment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Every shipment comes with real-time tracking. You can monitor
                  your package by:
                </p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Using your tracking number on our website</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Checking your email for status updates</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Logging into your account dashboard</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Ready to Ship?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Follow this guide and get your packages shipped safely and on
              time.
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
