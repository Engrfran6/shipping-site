"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import type { Profile } from "@/lib/types/database"

interface UserGrowthChartProps {
  users: Profile[]
}

export function UserGrowthChart({ users }: UserGrowthChartProps) {
  // Filter to client users only and group by month
  const clientUsers = users.filter((u) => u.user_type === "client")

  const monthlyData = clientUsers.reduce(
    (acc, user) => {
      const date = new Date(user.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const monthName = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthName,
          newUsers: 0,
          totalUsers: 0,
        }
      }

      acc[monthKey].newUsers += 1

      return acc
    },
    {} as Record<string, { month: string; newUsers: number; totalUsers: number }>,
  )

  // Calculate cumulative totals
  const chartData = Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .reduce(
      (acc, current, index) => {
        const totalUsers = index === 0 ? current.newUsers : acc[index - 1].totalUsers + current.newUsers
        acc.push({ ...current, totalUsers })
        return acc
      },
      [] as Array<{ month: string; newUsers: number; totalUsers: number }>,
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>New user registrations over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            newUsers: {
              label: "New Users",
              color: "hsl(var(--chart-2))",
            },
            totalUsers: {
              label: "Total Users",
              color: "hsl(var(--chart-3))",
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
                dataKey="newUsers"
                stroke="var(--color-newUsers)"
                strokeWidth={2}
                dot={{ fill: "var(--color-newUsers)" }}
              />
              <Line
                type="monotone"
                dataKey="totalUsers"
                stroke="var(--color-totalUsers)"
                strokeWidth={2}
                dot={{ fill: "var(--color-totalUsers)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
