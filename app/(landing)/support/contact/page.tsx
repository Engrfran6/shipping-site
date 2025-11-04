"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Handle form submission here
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* <Navbar /> */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-4 text-balance">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-600 text-pretty">
                Have questions? We'd love to hear from you. Contact us via
                email, phone, or the form below.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
              <Card className="border-gray-200 text-center">
                <CardHeader>
                  <div className="bg-blue-100 p-4 rounded-lg w-fit mx-auto mb-4">
                    <Mail className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Email</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p className="mb-2">support@swiftship.com</p>
                  <p className="text-sm">Response within 24 hours</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 text-center">
                <CardHeader>
                  <div className="bg-green-100 p-4 rounded-lg w-fit mx-auto mb-4">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>Phone</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p className="mb-2">1-800-SHIP-NOW</p>
                  <p className="text-sm">Available 24/7</p>
                </CardContent>
              </Card>

              <Card className="border-gray-200 text-center">
                <CardHeader>
                  <div className="bg-purple-100 p-4 rounded-lg w-fit mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>Office</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p className="mb-2">123 Logistics Ave</p>
                  <p className="text-sm">New York, NY 10001</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-2xl">
            <Card className="border-gray-200">
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>
                  We'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      placeholder="How can we help?"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      placeholder="Tell us more..."
                      rows={6}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Business Hours */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <Card className="border-gray-200">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle>Business Hours</CardTitle>
                    <CardDescription>When we're available</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="font-semibold">6 AM - 10 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="font-semibold">8 AM - 8 PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="font-semibold">10 AM - 6 PM EST</span>
                  </div>
                  <div className="pt-4 border-t border-gray-200 text-sm">
                    <p>
                      24/7 Support: Email anytime, phone support 24/7 for urgent
                      matters
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
