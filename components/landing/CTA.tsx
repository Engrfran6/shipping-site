import { Button } from "@/components/ui/button";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Ship?
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Join thousands of businesses who trust SwiftShip for their shipping
          needs. Get started today and experience the difference.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            asChild
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link href="/auth/signup">Create Account</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            <Link href="/quote">Get Quote</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
export default CTA;
