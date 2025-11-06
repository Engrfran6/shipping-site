import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Search} from "lucide-react";

interface MainTrackerProps {
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  handleTrack: (e: React.FormEvent) => void;
}

const MainTracker = ({
  trackingNumber,
  setTrackingNumber,
  isLoading,
  error,
  handleTrack,
}: MainTrackerProps) => {
  return (
    <div className="text-center space-y-8 md:mt-12">
      {/* Header */}
      <div className="max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800">Track Your Package</h1>
        <p className="text-gray-600 text-sm md:text-base">
          Enter your tracking number below to get real-time updates on your shipment’s progress.
        </p>
      </div>

      {/* Input Card */}
      <div className="max-w-lg mx-auto">
        <Card className="bg-white/70 backdrop-blur-lg shadow-xl border border-gray-100">
          <CardContent className="p-6">
            <form onSubmit={handleTrack} className="space-y-5">
              <div>
                <Label htmlFor="trackingNumber" className="pb-1 text-gray-700 font-semibold">
                  Tracking Number
                </Label>
                <Input
                  id="trackingNumber"
                  placeholder="e.g., AB12345678CD"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                  className="text-center font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 text-lg font-semibold transition-all shadow-sm hover:shadow-md"
                disabled={isLoading}>
                {isLoading ? (
                  "Tracking..."
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Search className="h-5 w-5" />
                    Track Shipment
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <p className="text-sm text-gray-500 mt-6">
        Need help? Contact{" "}
        <span className="text-blue-600 hover:underline cursor-pointer">customer support</span>.
      </p>
    </div>
  );
};
export default MainTracker;
