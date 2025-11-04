"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Globe, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
              About SwiftShip
            </h1>
            <p className="text-xl text-gray-600 text-pretty mb-8">
              We're a modern logistics company dedicated to making shipping
              simple, affordable, and reliable for businesses of all sizes.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Mission
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  To revolutionize the shipping industry by providing
                  innovative, transparent, and customer-centric logistics
                  solutions that empower businesses to reach customers anywhere.
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Our Vision
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  To be the most trusted and efficient shipping partner
                  globally, enabling seamless commerce and connection between
                  businesses and their customers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">10K+</div>
                <div className="text-blue-100">Active Customers</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">1M+</div>
                <div className="text-blue-100">Shipments Handled</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">99.9%</div>
                <div className="text-blue-100">On-Time Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-blue-100">Years of Experience</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Card className="border-gray-200">
                <CardHeader>
                  <div className="bg-blue-100 p-4 rounded-lg w-fit mb-4 mx-auto">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-center">Excellence</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600 text-sm">
                  We strive for excellence in every aspect of our service.
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <div className="bg-green-100 p-4 rounded-lg w-fit mb-4 mx-auto">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-center">Integrity</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600 text-sm">
                  We operate with honesty and transparency always.
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <div className="bg-purple-100 p-4 rounded-lg w-fit mb-4 mx-auto">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-center">Innovation</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600 text-sm">
                  We continuously innovate to improve our services.
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <div className="bg-orange-100 p-4 rounded-lg w-fit mb-4 mx-auto">
                    <Globe className="h-6 w-6 text-orange-600" />
                  </div>
                  <CardTitle className="text-center">Responsibility</CardTitle>
                </CardHeader>
                <CardContent className="text-center text-gray-600 text-sm">
                  We're committed to sustainable and ethical practices.
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Team
            </h2>
            <p className="text-gray-600 text-center mb-8 text-lg">
              SwiftShip is powered by a dedicated team of logistics experts,
              engineers, and customer service professionals passionate about
              shipping excellence.
            </p>
            <div className="bg-gray-50 p-8 rounded-lg text-center">
              <p className="text-gray-600 mb-6">
                With over 200 employees across 5 continents, we're here to serve
                you 24/7.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Link href="/company/careers">Join Our Team</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Partner with Us?
            </h2>
            <p className="text-lg mb-8 text-blue-100">
              Join thousands of businesses that trust SwiftShip for their
              logistics needs.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Link href="/auth/signup">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
