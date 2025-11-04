import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Clock, MapPin, Shield } from "lucide-react";

const Features = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose SwiftShip?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We provide comprehensive shipping solutions with cutting-edge
            technology and exceptional service.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-blue-100 p-3 rounded-lg w-fit">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-gray-900">Fast Delivery</CardTitle>
              <CardDescription>
                Express shipping options with same-day and overnight delivery
                available.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-green-100 p-3 rounded-lg w-fit">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-gray-900">Secure & Insured</CardTitle>
              <CardDescription>
                Full insurance coverage and secure handling for all your
                valuable shipments.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-gray-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="bg-purple-100 p-3 rounded-lg w-fit">
                <MapPin className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-gray-900">
                Real-time Tracking
              </CardTitle>
              <CardDescription>
                Track your packages every step of the way with live updates and
                notifications.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default Features;
