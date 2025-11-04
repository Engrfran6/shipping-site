"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";

const jobOpenings = [
  {
    title: "Senior Logistics Manager",
    location: "New York, NY",
    type: "Full-time",
    salary: "$100,000 - $130,000",
  },
  {
    title: "Software Engineer",
    location: "Remote",
    type: "Full-time",
    salary: "$120,000 - $160,000",
  },
  {
    title: "Customer Support Specialist",
    location: "Chicago, IL",
    type: "Full-time",
    salary: "$50,000 - $65,000",
  },
  {
    title: "Data Analyst",
    location: "San Francisco, CA",
    type: "Full-time",
    salary: "$90,000 - $120,000",
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* <Navbar /> */}

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
              Join Our Team
            </h1>
            <p className="text-xl text-gray-600 text-pretty mb-8">
              Help us revolutionize the shipping industry. We're hiring talented
              individuals who share our passion for excellence.
            </p>
          </div>
        </section>

        {/* Why Work With Us */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Why Work at SwiftShip?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Competitive Benefits</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2 text-sm">
                    <li>✓ Health & wellness programs</li>
                    <li>✓ 401(k) matching</li>
                    <li>✓ Flexible work arrangements</li>
                    <li>✓ Professional development</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Growth Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2 text-sm">
                    <li>✓ Career advancement paths</li>
                    <li>✓ Training programs</li>
                    <li>✓ Mentorship opportunities</li>
                    <li>✓ Internal mobility</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Innovative Culture</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2 text-sm">
                    <li>✓ Collaborative environment</li>
                    <li>✓ Cutting-edge technology</li>
                    <li>✓ Creative freedom</li>
                    <li>✓ Continuous innovation</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardHeader>
                  <CardTitle>Work-Life Balance</CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <ul className="space-y-2 text-sm">
                    <li>✓ Remote work options</li>
                    <li>✓ Flexible schedules</li>
                    <li>✓ Generous PTO</li>
                    <li>✓ Company events</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
              Open Positions
            </h2>
            <div className="space-y-4">
              {jobOpenings.map((job, index) => (
                <Card
                  key={index}
                  className="border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                      <div className="text-right">
                        <Button
                          size="sm"
                          asChild
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Link href="#apply">Apply Now</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-blue-600 text-white">
          <div className="container mx-auto text-center max-w-3xl">
            <h2 className="text-3xl font-bold mb-4">Don't see your role?</h2>
            <p className="text-lg mb-8 text-blue-100">
              We're always looking for talented people. Send us your resume and
              we'll keep it on file.
            </p>
            <Button
              size="lg"
              asChild
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Link href="mailto:careers@swiftship.com">Send Your Resume</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
