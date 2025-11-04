"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { Shipment } from "@/lib/types/database"

interface ServicePerformanceChartProps {
  shipments: Shipment[]
}

export function ServicePerformanceChart({ shipments }: ServicePerformanceChartProps) {
  // Group by service type and calculate performance metrics
  const serviceData = shipments.reduce(
    (acc, shipment) => {
      const service = shipment.service_type
      if (!acc[service]) {
        acc[service] = {
          name: service
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          total: 0,
          delivered: 0,
          revenue: 0,
        }
      }

      acc[service].total += 1
      acc[service].revenue += shipment.total_cost || 0
      if (shipment.status === "delivered") {
        acc[service].delivered += 1
      }

      return acc
    },
    {} as Record<string, { name: string; total: number; delivered: number; revenue: number }>,
  )

  const chartData = Object.values(serviceData).map((item) => ({
    ...item,
    deliveryRate: item.total > 0 ? (item.delivered / item.total) * 100 : 0,
    avgRevenue: item.total > 0 ? item.revenue / item.total : 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Performance</CardTitle>
        <CardDescription>Delivery rates and revenue by service type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            deliveryRate: {
              label: "Delivery Rate (%)",
              color: "hsl(var(--chart-4))",
            },
            avgRevenue: {
              label: "Avg Revenue",
              color: "hsl(var(--chart-5))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  name === "deliveryRate" ? `${Number(value).toFixed(1)}%` : `$${Number(value).toFixed(2)}`,
                  name === "deliveryRate" ? "Delivery Rate" : "Avg Revenue",
                ]}
              />
              <Bar dataKey="deliveryRate" fill="var(--color-deliveryRate)" name="Delivery Rate" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
