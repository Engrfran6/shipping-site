"use client";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* <Navbar /> */}

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Privacy Policy
            </h1>

            <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
              <p className="text-lg">Last Updated: January 2024</p>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Introduction
                </h2>
                <p>
                  SwiftShip ("we," "us," "our," or "Company") is committed to
                  protecting your privacy. This Privacy Policy explains how we
                  collect, use, disclose, and safeguard your information when
                  you visit our website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Information We Collect
                </h2>
                <p>
                  We collect information you provide directly to us, such as
                  when you create an account, submit a shipment, or contact us.
                  This includes your name, email address, phone number, address,
                  and payment information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. How We Use Your Information
                </h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide and maintain our services</li>
                  <li>Process your shipments and payments</li>
                  <li>Send you transactional emails</li>
                  <li>Improve our services</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Information Sharing
                </h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal
                  information to outside parties except as necessary to provide
                  our services or comply with legal obligations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Data Security
                </h2>
                <p>
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Your Rights
                </h2>
                <p>
                  You have the right to access, correct, or delete your personal
                  information. Contact us at privacy@swiftship.com to exercise
                  these rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Contact Us
                </h2>
                <p>
                  If you have questions about this Privacy Policy, please
                  contact us at:
                </p>
                <p className="font-semibold">
                  SwiftShip
                  <br />
                  123 Logistics Ave
                  <br />
                  New York, NY 10001
                  <br />
                  privacy@swiftship.com
                </p>
              </section>
            </div>
          </div>
        </section>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
