import { QuoteForm } from "@/components/guest/quote-form"

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Get Shipping Quote</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Get an instant quote for your shipping needs. No account required.
          </p>
        </div>
        <QuoteForm />
      </div>
    </div>
  )
}
