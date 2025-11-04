import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function SignupSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Account Created!
              </CardTitle>
              <CardDescription className="text-gray-600">
                Please check your email to verify your account
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-gray-600 mb-6">
                We've sent a verification email to your inbox. Please click the
                link in the email to activate your account and start shipping.
              </p>
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Link href="/auth/login">Return to Sign In</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                >
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
