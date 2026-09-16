"use client";

import React, { useSyncExternalStore } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useRouter } from "next/navigation";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

interface StatusCountItem {
  status: string;
  label: string;
  count: number;
}

interface StatusStatusBarChartProps {
  data: StatusCountItem[];
}

export default function StatusStatusBarChart({ data }: StatusStatusBarChartProps) {
  const router = useRouter();
  const mounted = useIsMounted();

  const handleBarClick = (entry: StatusCountItem) => {
    if (entry && entry.status) {
      router.push(`/admin/leads?status=${entry.status}`);
    }
  };

  if (!mounted) {
    return (
      <div className="h-[260px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#64748b",
              fontSize: 11,
              fontFamily: "var(--font-inter), sans-serif",
            }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 11,
              fontFamily: "var(--font-inter), sans-serif",
            }}
          />
          <Tooltip
            cursor={{ fill: "#f8fafc" }}
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 20px -2px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "12px",
            }}
            formatter={(value: unknown) => [`${String(value)} leads`, "Count"]}
          />
          <Bar
            dataKey="count"
            fill="#491612"
            radius={[6, 6, 0, 0]}
            maxBarSize={42}
            onClick={(entry) => handleBarClick(entry as unknown as StatusCountItem)}
            className="cursor-pointer hover:opacity-85 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
