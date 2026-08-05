"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface SeverityChartProps {
  stats?: { critical: number; high: number; medium: number; low: number };
}

export default function SeverityChart({ stats }: SeverityChartProps) {
  const data = [
    { name: "Critical", value: stats?.critical ?? 84, color: "#ef4444" },
    { name: "High", value: stats?.high ?? 231, color: "#f97316" },
    { name: "Medium", value: stats?.medium ?? 582, color: "#eab308" },
    { name: "Low", value: stats?.low ?? 351, color: "#22c55e" },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="h-[300px] w-full mt-4 relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
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
            {data.map((entry, index) => (
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
      </ResponsiveContainer>
    </div>
  );
}
