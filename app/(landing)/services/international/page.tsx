"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, DollarSign, FileText, Globe, MapPin } from "lucide-react";
import Link from "next/link";

export default function InternationalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* <Navbar /> */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center bg-purple-100 p-4 rounded-lg mb-6">
                <Globe className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-5xl font-bold text-gray-900 mb-4 text-balance">
                International Shipping
              </h1>
              <p className="text-xl text-gray-600 text-pretty mb-8">
                Expand your reach globally. We handle customs, documentation,
                and door-to-door delivery to 200+ countries worldwide.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Link href="#quote">Get Global Quote</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Global Shipping Benefits
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Global Coverage</CardTitle>
                  <CardDescription>200+ countries worldwide</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Door-to-door delivery</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Multiple service options</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Customs Handling</CardTitle>
                  <CardDescription>We manage all documentation</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Complete customs clearance</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Duty and tax handling</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Real-Time Tracking</CardTitle>
                  <CardDescription>Track globally with ease</CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>International tracking</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Multi-language support</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                    <DollarSign className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle>Transparent Pricing</CardTitle>
                  <CardDescription>
                    No hidden international fees
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>All-inclusive rates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Volume discounts</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Service Options */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              International Service Options
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Economy International</CardTitle>
                  <CardDescription>7-14 business days</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Budget-friendly option for non-urgent shipments.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Best value</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Standard insurance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Express International</CardTitle>
                  <CardDescription>3-5 business days</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Faster international delivery with priority handling.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Priority routing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>Enhanced insurance</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-purple-600 text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Ship to the World</h2>
            <p className="text-lg mb-8 text-purple-100">
              Reach customers anywhere with our comprehensive international
              shipping solutions.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-purple-600 hover:bg-purple-50"
            >
              <Link href="/auth/signup">Start Global Shipping</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
