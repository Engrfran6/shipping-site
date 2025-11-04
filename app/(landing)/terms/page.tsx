"use client";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* <Navbar /> */}

      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Terms of Service
            </h1>

            <div className="prose prose-gray max-w-none text-gray-600 space-y-6">
              <p className="text-lg">Last Updated: January 2024</p>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Agreement to Terms
                </h2>
                <p>
                  By accessing and using the SwiftShip website and services, you
                  accept and agree to be bound by the terms and provision of
                  this agreement. If you do not agree to abide by the above,
                  please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. Use License
                </h2>
                <p>
                  Permission is granted to temporarily download one copy of the
                  materials (information or software) on SwiftShip's website for
                  personal, non-commercial transitory viewing only. This is the
                  grant of a license, not a transfer of title.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Disclaimer
                </h2>
                <p>
                  The materials on SwiftShip's website are provided on an 'as
                  is' basis. SwiftShip makes no warranties, expressed or
                  implied, and hereby disclaims and negates all other warranties
                  including, without limitation, implied warranties or
                  conditions of merchantability, fitness for a particular
                  purpose, or non-infringement of intellectual property or other
                  violation of rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Limitations
                </h2>
                <p>
                  In no event shall SwiftShip or its suppliers be liable for any
                  damages (including, without limitation, damages for loss of
                  data or profit, or due to business interruption) arising out
                  of the use or inability to use the materials on SwiftShip's
                  website.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Accuracy of Materials
                </h2>
                <p>
                  The materials appearing on SwiftShip's website could include
                  technical, typographical, or photographic errors. SwiftShip
                  does not warrant that any of the materials on its website are
                  accurate, complete, or current.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Links
                </h2>
                <p>
                  SwiftShip has not reviewed all of the sites linked to its
                  website and is not responsible for the contents of any such
                  linked site. The inclusion of any link does not imply
                  endorsement by SwiftShip of the site. Use of any such linked
                  website is at the user's own risk.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. Modifications
                </h2>
                <p>
                  SwiftShip may revise these terms of service for its website at
                  any time without notice. By using this website, you are
                  agreeing to be bound by the then current version of these
                  terms of service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Governing Law
                </h2>
                <p>
                  These terms and conditions are governed by and construed in
                  accordance with the laws of the United States, and you
                  irrevocably submit to the exclusive jurisdiction of the courts
                  in that location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Contact Us
                </h2>
                <p>
                  If you have any questions about these Terms of Service, please
                  contact us at:
                </p>
                <p className="font-semibold">
                  SwiftShip
                  <br />
                  123 Logistics Ave
                  <br />
                  New York, NY 10001
                  <br />
                  legal@swiftship.com
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
