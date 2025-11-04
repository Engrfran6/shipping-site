"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, Printer } from "lucide-react";
import { useRef } from "react";

interface Shipment {
  id: string;
  tracking_number: string;
  status: string;
  service_type: string;
  sender_name: string;
  sender_address: string;
  sender_city: string;
  sender_state: string;
  sender_postal_code: string;
  recipient_name: string;
  recipient_address: string;
  recipient_city: string;
  recipient_state: string;
  recipient_postal_code: string;
  package_type: string;
  weight_kg: number;
  base_cost: number;
  insurance_cost: number;
  tax_amount: number;
  total_cost: number;
  created_at: string;
  profiles?: {
    full_name?: string;
    email: string;
    company_name?: string;
  };
}

export function ReceiptGenerator({ shipment }: { shipment: Shipment }) {
  const receiptRef = useRef<HTMLDivElement>(null);

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`receipt-${shipment.tracking_number}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePrint = () => {
    if (!receiptRef.current) return;
    const printWindow = window.open("", "", "height=500,width=800");
    if (printWindow) {
      printWindow.document.write(receiptRef.current.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shipment Receipt</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadPDF}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          ref={receiptRef}
          className="bg-white p-8 border-2 border-gray-200 rounded-lg"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Header */}
          <div className="text-center mb-8 pb-6 border-b-2">
            <h1 className="text-3xl font-bold text-gray-900">RECEIPT</h1>
            <p className="text-gray-600 text-sm">Shipping Receipt</p>
          </div>

          {/* Receipt Number & Date */}
          <div className="grid grid-cols-2 gap-4 mb-8 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600">Receipt #</p>
              <p className="font-bold text-lg">{shipment.tracking_number}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-bold text-lg">
                {new Date(shipment.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* From & To */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b">
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">FROM</p>
              <p className="text-sm font-medium">{shipment.sender_name}</p>
              <p className="text-sm text-gray-600">{shipment.sender_address}</p>
              <p className="text-sm text-gray-600">
                {shipment.sender_city}, {shipment.sender_state}{" "}
                {shipment.sender_postal_code}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 mb-2">TO</p>
              <p className="text-sm font-medium">{shipment.recipient_name}</p>
              <p className="text-sm text-gray-600">
                {shipment.recipient_address}
              </p>
              <p className="text-sm text-gray-600">
                {shipment.recipient_city}, {shipment.recipient_state}{" "}
                {shipment.recipient_postal_code}
              </p>
            </div>
          </div>

          {/* Package Details */}
          <div className="mb-8 pb-6 border-b">
            <p className="text-sm font-bold text-gray-900 mb-3">
              PACKAGE DETAILS
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Package Type:</span>
                <span className="font-medium">
                  {formatStatus(shipment.package_type)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Weight:</span>
                <span className="font-medium">{shipment.weight_kg} kg</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Service Type:</span>
                <span className="font-medium">
                  {formatStatus(shipment.service_type)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">
                  {formatStatus(shipment.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Charges */}
          <div className="mb-8">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Shipping Charge</td>
                  <td className="py-2 text-right font-medium">
                    ${shipment.base_cost.toFixed(2)}
                  </td>
                </tr>
                {shipment.insurance_cost > 0 && (
                  <tr className="border-b">
                    <td className="py-2 text-gray-600">Insurance</td>
                    <td className="py-2 text-right font-medium">
                      ${shipment.insurance_cost.toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr className="border-b">
                  <td className="py-2 text-gray-600">Tax</td>
                  <td className="py-2 text-right font-medium">
                    ${shipment.tax_amount.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-blue-50">
                  <td className="py-3 font-bold text-gray-900">TOTAL</td>
                  <td className="py-3 text-right font-bold text-lg text-blue-600">
                    ${shipment.total_cost.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500 pt-6 border-t">
            <p>Thank you for using our shipping service!</p>
            <p>This receipt is non-transferable and for your records.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
