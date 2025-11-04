"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts"
import type { Shipment } from "@/lib/types/database"

interface ServiceTypeChartProps {
  shipments: Shipment[]
}

export function ServiceTypeChart({ shipments }: ServiceTypeChartProps) {
  // Group by service type
  const serviceData = shipments.reduce(
    (acc, shipment) => {
      const service = shipment.service_type
      if (!acc[service]) {
        acc[service] = { name: service, value: 0, cost: 0 }
      }
      acc[service].value += 1
      acc[service].cost += shipment.total_cost || 0
      return acc
    },
    {} as Record<string, { name: string; value: number; cost: number }>,
  )

  const chartData = Object.values(serviceData).map((item) => ({
    ...item,
    name: item.name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }))

  const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Type Distribution</CardTitle>
        <CardDescription>Breakdown of shipping services used</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            standard: { label: "Standard", color: "hsl(var(--chart-1))" },
            express: { label: "Express", color: "hsl(var(--chart-2))" },
            overnight: { label: "Overnight", color: "hsl(var(--chart-3))" },
            international: { label: "International", color: "hsl(var(--chart-4))" },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [`${value} shipments`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
