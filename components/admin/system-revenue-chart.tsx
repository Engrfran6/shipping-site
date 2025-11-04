"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { Shipment } from "@/lib/types/database"

interface SystemRevenueChartProps {
  shipments: Shipment[]
}

export function SystemRevenueChart({ shipments }: SystemRevenueChartProps) {
  // Group by month and calculate cumulative revenue
  const monthlyData = shipments.reduce(
    (acc, shipment) => {
      const date = new Date(shipment.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          revenue: 0,
          shipments: 0,
        }
      }

      acc[monthKey].revenue += shipment.total_cost || 0
      acc[monthKey].shipments += 1

      return acc
    },
    {} as Record<string, { month: string; revenue: number; shipments: number }>,
  )

  const chartData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Trends</CardTitle>
        <CardDescription>Monthly revenue across all users</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                fill="var(--color-revenue)"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
