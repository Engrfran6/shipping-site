import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10 bg-gradient-to-br from-red-50 to-pink-100">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Authentication Error</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              {params?.error ? (
                <p className="text-sm text-gray-600 mb-6">Error: {params.error}</p>
              ) : (
                <p className="text-sm text-gray-600 mb-6">An authentication error occurred. Please try again.</p>
              )}
              <div className="space-y-3">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Link href="/auth/login">Try Again</Link>
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
  )
}
