"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Shipment } from "@/lib/types/database"

interface DeliveryPerformanceProps {
  shipments: Shipment[]
}

export function DeliveryPerformance({ shipments }: DeliveryPerformanceProps) {
  // Calculate delivery performance by status
  const statusCounts = shipments.reduce(
    (acc, shipment) => {
      acc[shipment.status] = (acc[shipment.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const total = shipments.length
  const delivered = statusCounts.delivered || 0
  const inTransit = statusCounts.in_transit || 0
  const outForDelivery = statusCounts.out_for_delivery || 0
  const exceptions = statusCounts.exception || 0
  const cancelled = statusCounts.cancelled || 0

  const deliveryRate = total > 0 ? (delivered / total) * 100 : 0
  const activeRate = total > 0 ? ((inTransit + outForDelivery) / total) * 100 : 0
  const exceptionRate = total > 0 ? (exceptions / total) * 100 : 0

  const performanceData = [
    {
      label: "Delivered",
      count: delivered,
      percentage: deliveryRate,
      color: "bg-green-500",
    },
    {
      label: "In Transit",
      count: inTransit + outForDelivery,
      percentage: activeRate,
      color: "bg-blue-500",
    },
    {
      label: "Exceptions",
      count: exceptions,
      percentage: exceptionRate,
      color: "bg-red-500",
    },
    {
      label: "Cancelled",
      count: cancelled,
      percentage: total > 0 ? (cancelled / total) * 100 : 0,
      color: "bg-gray-500",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delivery Performance</CardTitle>
        <CardDescription>Status breakdown of all shipments</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {performanceData.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{item.label}</span>
              <span className="text-sm text-gray-500">
                {item.count} ({item.percentage.toFixed(1)}%)
              </span>
            </div>
            <Progress value={item.percentage} className="h-2" />
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">{deliveryRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{activeRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">Active Shipments</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
