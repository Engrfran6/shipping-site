import {Truck} from "lucide-react";
import Link from "next/link";
import {MobileNavDrawer} from "../mobile-nav-drawer";
import {Button} from "../ui/button";

const Navbar = () => {
  const navigation = [
    {name: "Home", href: "/"},
    {name: "Track", href: "/track"},
    {name: "Quote", href: "/quote"},
    {name: "Sign In", href: "/auth/login"},
    {name: "Sign Up", href: "/auth/signup"},
  ];
  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SwiftShip</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          {/* <Link href="#services" className="text-gray-600 hover:text-blue-600 transition-colors">
            Services
          </Link> */}
          <Link href="/track" className="text-gray-600 hover:text-blue-600 transition-colors">
            Track Shipment
          </Link>
          <Link href="/quote" className="text-gray-600 hover:text-blue-600 transition-colors">
            Get Quote
          </Link>
          <Link href="/auth/login" className="text-gray-600 hover:text-blue-600 transition-colors">
            Sign In
          </Link>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
        </nav>
        <div className="md:hidden flex items-center">
          <Link
            href="/track"
            className="mr-1 border border-blue-700 px-4 rounded-2xl text-gray-600 hover:text-blue-600 transition-colors">
            Track
          </Link>
          <MobileNavDrawer items={navigation} />
        </div>
      </div>
    </header>
  );
};
export default Navbar;
