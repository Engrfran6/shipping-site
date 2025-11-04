"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { Shipment } from "@/lib/types/database"

interface CostAnalysisProps {
  shipments: Shipment[]
}

export function CostAnalysis({ shipments }: CostAnalysisProps) {
  // Group shipments by month for cost analysis
  const monthlyData = shipments.reduce(
    (acc, shipment) => {
      const date = new Date(shipment.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          cost: 0,
          count: 0,
        }
      }

      acc[monthKey].cost += shipment.total_cost || 0
      acc[monthKey].count += 1

      return acc
    },
    {} as Record<string, { month: string; cost: number; count: number }>,
  )

  const chartData = Object.values(monthlyData)
    .map((data) => ({
      ...data,
      avgCost: data.count > 0 ? data.cost / data.count : 0,
    }))
    .sort((a, b) => a.month.localeCompare(b.month))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Analysis</CardTitle>
        <CardDescription>Monthly shipping costs and averages</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            cost: {
              label: "Total Cost",
              color: "hsl(var(--chart-2))",
            },
            avgCost: {
              label: "Average Cost",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [
                  `$${Number(value).toFixed(2)}`,
                  name === "cost" ? "Total Cost" : "Average Cost",
                ]}
              />
              <Bar dataKey="cost" fill="var(--color-cost)" name="Total Cost" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
