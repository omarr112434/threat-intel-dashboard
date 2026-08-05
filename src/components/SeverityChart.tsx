"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface SeverityChartProps {
  stats?: { critical: number; high: number; medium: number; low: number; unknown: number };
}

export default function SeverityChart({ stats }: SeverityChartProps) {
  const data = [
    { name: "Critical", value: stats?.critical || 0, color: "#ef4444" },
    { name: "High", value: stats?.high || 0, color: "#f97316" },
    { name: "Medium", value: stats?.medium || 0, color: "#eab308" },
    { name: "Low", value: stats?.low || 0, color: "#22c55e" },
    { name: "Unknown", value: stats?.unknown || 0, color: "#64748b" },
  ];

  // If total is 0 (like before API loads), show a placeholder slice
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const chartData = total === 0 ? [{ name: "Loading...", value: 1, color: "#334155" }] : data;

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-[300px] w-full mt-4 flex items-center justify-center text-slate-500">Loading chart...</div>;

  return (
    <div className="h-[300px] w-full mt-4 relative flex justify-center items-center">
      <PieChart width={350} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
          stroke="rgba(51, 65, 85, 0.5)"
          animationBegin={0}
          animationDuration={800}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", borderRadius: "8px" }}
          itemStyle={{ color: "#f8fafc" }}
          formatter={(value: number) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, '']}
        />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </div>
  );
}
