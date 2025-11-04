"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { Shipment } from "@/lib/types/database"

interface ShippingChartProps {
  shipments: Shipment[]
}

export function ShippingChart({ shipments }: ShippingChartProps) {
  // Group shipments by month
  const monthlyData = shipments.reduce(
    (acc, shipment) => {
      const date = new Date(shipment.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          shipments: 0,
          cost: 0,
        }
      }

      acc[monthKey].shipments += 1
      acc[monthKey].cost += shipment.total_cost || 0

      return acc
    },
    {} as Record<string, { month: string; shipments: number; cost: number }>,
  )

  const chartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Volume</CardTitle>
        <CardDescription>Number of shipments over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            shipments: {
              label: "Shipments",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="shipments"
                stroke="var(--color-shipments)"
                strokeWidth={2}
                dot={{ fill: "var(--color-shipments)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
