"use client"

import {
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts"

const data = [
  {
    quarter: "Q1",
    score: 70,
  },
  {
    quarter: "Q2",
    score: 82,
  },
  {
    quarter: "Q3",
    score: 90,
  },
  {
    quarter: "Q4",
    score: 95,
  },
]

export function PerformanceChart() {
  return (
    <div className="h-80 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">
          Quarterly Performance
        </h2>

        <p className="text-sm text-slate-400">
          Achievement progress overview
        </p>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="quarter" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="score" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}