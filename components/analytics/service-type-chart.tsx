"use client";

import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import type {Shipment} from "@/lib/types/database";
import {useEffect, useState} from "react";
import {Cell, Pie, PieChart, ResponsiveContainer} from "recharts";

interface ServiceTypeChartProps {
  shipments: Shipment[];
}

export function ServiceTypeChart({shipments}: ServiceTypeChartProps) {
  // Track viewport width to adjust rendering on mobile
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const showLabels = width > 420; // hide long labels on narrow screens
  const outerRadius = showLabels ? 80 : 56; // smaller on mobile

  // Group by service type
  const serviceData = shipments.reduce((acc, shipment) => {
    const service = shipment.service_type;
    if (!acc[service]) {
      acc[service] = {name: service, value: 0, cost: 0};
    }
    acc[service].value += 1;
    acc[service].cost += shipment.total_cost || 0;
    return acc;
  }, {} as Record<string, {name: string; value: number; cost: number}>);

  const chartData = Object.values(serviceData).map((item) => ({
    ...item,
    name: item.name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  }));

  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ];

  return (
    <Card className="overflow-scroll">
      <CardHeader>
        <CardTitle>Service Type Distribution</CardTitle>
        <CardDescription>Breakdown of shipping services used</CardDescription>
      </CardHeader>
      <CardContent className="max-w-full overflow-hidden">
        <ChartContainer
          config={{
            standard: {label: "Standard", color: "hsl(var(--chart-1))"},
            express: {label: "Express", color: "hsl(var(--chart-2))"},
            overnight: {label: "Overnight", color: "hsl(var(--chart-3))"},
            international: {label: "International", color: "hsl(var(--chart-4))"},
          }}
          // responsive height: smaller on very small screens
          className="h-[220px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={
                  showLabels
                    ? ({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`
                    : undefined
                }
                outerRadius={outerRadius}
                fill="#8884d8"
                dataKey="value">
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
  );
}
