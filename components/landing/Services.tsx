import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Clock, MapPin, Package, Truck } from "lucide-react";

const Services = () => {
  return (
    <section id="services" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Our Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose from our range of shipping options designed to meet your
            specific needs.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white border-gray-200">
            <CardHeader className="text-center">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Standard Shipping</CardTitle>
              <CardDescription>5-7 business days</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Cost-effective
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Reliable delivery
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Package tracking
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardHeader className="text-center">
              <Truck className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Express Shipping</CardTitle>
              <CardDescription>2-3 business days</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Priority handling
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Faster delivery
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Real-time updates
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardHeader className="text-center">
              <Clock className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Overnight</CardTitle>
              <CardDescription>Next business day</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Urgent delivery
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Morning delivery
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Signature required
                </li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-white border-gray-200">
            <CardHeader className="text-center">
              <MapPin className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <CardTitle className="text-lg">International</CardTitle>
              <CardDescription>7-14 business days</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Global reach
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Customs handling
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                  Door-to-door
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
export default Services;
