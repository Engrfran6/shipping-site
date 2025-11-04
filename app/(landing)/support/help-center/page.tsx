"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FileText, Headphones, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const FAQItems = [
  {
    question: "How do I track my package?",
    answer:
      "You can track your package in real-time using the tracking number provided at checkout. Visit our Track Package page or use the link in your confirmation email.",
  },
  {
    question: "What are your shipping rates?",
    answer:
      "Shipping rates vary based on weight, distance, and service type. Use our Quote Calculator to get instant rates, or contact our sales team for bulk pricing.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "We offer full refunds for unshipped packages. For shipped packages, contact our support team to discuss options.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship to 200+ countries. Check our International Shipping page for rates and delivery times.",
  },
  {
    question: "Can I modify my shipment after booking?",
    answer:
      "Modifications are possible if the shipment hasn't been picked up yet. Contact us immediately at support@swiftship.com or call 1-800-SHIP-NOW.",
  },
  {
    question: "What insurance options are available?",
    answer:
      "All shipments include basic insurance. Enhanced coverage up to $5,000 is available for an additional fee.",
  },
];

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);

  const filteredFAQ = FAQItems.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* <Navbar /> */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 text-balance">
                Help Center
              </h1>
              <p className="text-xl text-gray-600 text-pretty mb-8">
                Find answers to common questions about shipping, tracking,
                billing, and more.
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 px-4 bg-white">
          <div className="container mx-auto max-w-3xl">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search for help..."
                className="pl-12 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Quick Resources
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Shipping Guide</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Learn how to prepare your shipment and use our services.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                    <Headphones className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">Contact Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Get in touch with our support team via phone, email, or
                    chat.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                    <MessageCircle className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">Community Forum</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Connect with other users and share experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {filteredFAQ.map((item, index) => (
                <Card
                  key={index}
                  className="border-gray-200 hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() =>
                      setSelectedFAQ(selectedFAQ === index ? null : index)
                    }
                    className="w-full text-left p-6 focus:outline-none"
                  >
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {item.question}
                      </h3>
                      <span className="text-blue-600 ml-4 flex-shrink-0">
                        {selectedFAQ === index ? "−" : "+"}
                      </span>
                    </div>
                  </button>
                  {selectedFAQ === index && (
                    <div className="px-6 pb-6 border-t border-gray-200 pt-4">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">
              Didn't find what you're looking for?
            </h2>
            <p className="text-lg mb-8 text-blue-100">
              Our support team is here to help. Contact us anytime.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Link href="/support/contact">Contact Us</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
