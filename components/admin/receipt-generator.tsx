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

export function InvoiceGenerator({ shipment }: { shipment: Shipment }) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const formatStatus = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const invoiceNumber =
    shipment.tracking_number.replace(/[^0-9]/g, "").slice(-8) ||
    Date.now().toString();

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
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

      pdf.save(`invoice-${shipment.tracking_number}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handlePrint = () => {
    if (!invoiceRef.current) return;
    const printWindow = window.open("", "", "height=500,width=800");
    if (printWindow) {
      printWindow.document.write(invoiceRef.current.innerHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Shipment Invoice</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadPDF}
              className="bg-green-600 hover:bg-green-700"
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
          ref={invoiceRef}
          className="bg-white p-8 border-2 border-gray-200 rounded-lg"
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-8 pb-6 border-b-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
              <p className="text-gray-600 text-sm">Shipping Service Invoice</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-600">Invoice #</p>
              <p className="text-lg font-bold">{invoiceNumber}</p>
              <p className="text-xs text-gray-600 mt-2">Date</p>
              <p className="text-sm font-bold">
                {new Date(shipment.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Bill To & Ship To */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b">
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-2">
                Bill To
              </p>
              {shipment.profiles ? (
                <>
                  <p className="text-sm font-medium">
                    {shipment.profiles.full_name || "Customer"}
                  </p>
                  {shipment.profiles.company_name && (
                    <p className="text-sm text-gray-600">
                      {shipment.profiles.company_name}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    {shipment.profiles.email}
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-600">Guest Customer</p>
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-600 uppercase mb-2">
                Ship To
              </p>
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

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full text-sm mb-6">
              <thead>
                <tr className="border-b-2 border-gray-900">
                  <th className="text-left py-3 text-gray-900 font-bold">
                    Description
                  </th>
                  <th className="text-right py-3 text-gray-900 font-bold">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 text-gray-700">
                    <div className="font-medium">
                      {formatStatus(shipment.service_type)} Shipping Service
                    </div>
                    <div className="text-xs text-gray-600">
                      Tracking: {shipment.tracking_number}
                    </div>
                    <div className="text-xs text-gray-600">
                      {shipment.sender_city}, {shipment.sender_state} →{" "}
                      {shipment.recipient_city}, {shipment.recipient_state}
                    </div>
                    <div className="text-xs text-gray-600">
                      Package: {formatStatus(shipment.package_type)} (
                      {shipment.weight_kg} kg)
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    ${shipment.base_cost.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">
                  ${shipment.base_cost.toFixed(2)}
                </span>
              </div>
              {shipment.insurance_cost > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Insurance</span>
                  <span className="font-medium">
                    ${shipment.insurance_cost.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm pb-3 border-b">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">
                  ${shipment.tax_amount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold bg-green-50 p-3 rounded">
                <span className="text-gray-900">TOTAL AMOUNT DUE</span>
                <span className="text-green-600">
                  ${shipment.total_cost.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="text-center text-xs text-gray-500 pt-6 border-t">
            <p className="font-medium mb-2">Payment Terms</p>
            <p>
              Please pay the total amount within 30 days of receiving this
              invoice.
            </p>
            <p>Thank you for your business!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
