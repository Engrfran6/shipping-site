import {Truck} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2  mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Truck className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">SwiftShip</span>
            </Link>
            <p className="text-gray-400 text-sm">
              Professional shipping solutions for businesses worldwide.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link
                  href="/services/standard-shipping"
                  className="hover:text-white transition-colors">
                  Standard Shipping
                </Link>
              </li>
              <li>
                <Link
                  href="/services/express-delivery"
                  className="hover:text-white transition-colors">
                  Express Delivery
                </Link>
              </li>
              <li>
                <Link href="/services/overnight" className="hover:text-white transition-colors">
                  Overnight
                </Link>
              </li>
              <li>
                <Link href="/services/international" className="hover:text-white transition-colors">
                  International
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Package
                </Link>
              </li>
              <li>
                <Link href="/support/help-center" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/support/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/support/shipping-guide" className="hover:text-white transition-colors">
                  Shipping Guide
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/company/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/company/careers" className="hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 SwiftShip. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
