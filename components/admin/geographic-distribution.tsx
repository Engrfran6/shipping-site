"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Shipment } from "@/lib/types/database"

interface GeographicDistributionProps {
  shipments: Shipment[]
}

export function GeographicDistribution({ shipments }: GeographicDistributionProps) {
  // Group by destination state
  const stateData = shipments.reduce(
    (acc, shipment) => {
      const state = shipment.recipient_state
      if (!acc[state]) {
        acc[state] = {
          state,
          count: 0,
          revenue: 0,
        }
      }
      acc[state].count += 1
      acc[state].revenue += shipment.total_cost || 0
      return acc
    },
    {} as Record<string, { state: string; count: number; revenue: number }>,
  )

  const sortedStates = Object.values(stateData)
    .sort((a, b) => b.count - a.count)
    .slice(0, 10) // Top 10 states

  const maxCount = Math.max(...sortedStates.map((s) => s.count))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <CardDescription>Top 10 destination states by shipment volume</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedStates.map((item) => {
          const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0
          return (
            <div key={item.state} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{item.state}</span>
                <div className="text-right">
                  <span className="text-sm font-medium">{item.count} shipments</span>
                  <div className="text-xs text-gray-500">${item.revenue.toFixed(2)} revenue</div>
                </div>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>
          )
        })}

        {sortedStates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No geographic data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
