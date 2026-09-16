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

interface RequirementItem {
  label: string;
  count: number;
}

interface RequirementBarChartProps {
  data: RequirementItem[];
}

export default function RequirementBarChart({ data }: RequirementBarChartProps) {
  const router = useRouter();
  const mounted = useIsMounted();

  const handleReqClick = (entry: RequirementItem) => {
    if (entry && entry.label) {
      router.push(`/admin/leads?requirement=${encodeURIComponent(entry.label)}`);
    }
  };

  if (!mounted) {
    return (
      <div className="h-[260px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const chartData = data && data.length > 0 ? data.slice(0, 6) : [];

  if (chartData.length === 0) {
    return (
      <div className="h-[260px] flex items-center justify-center text-slate-400 font-body text-xs">
        No requirement data available
      </div>
    );
  }

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 10, right: 20, left: 20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={false}
            stroke="#f1f5f9"
          />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
            tick={{
              fill: "#94a3b8",
              fontSize: 11,
              fontFamily: "var(--font-inter), sans-serif",
            }}
          />
          <YAxis
            type="category"
            dataKey="label"
            axisLine={false}
            tickLine={false}
            width={120}
            tick={{
              fill: "#334155",
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
            formatter={(value: unknown) => [`${String(value)} leads`, "Inquiries"]}
          />
          <Bar
            dataKey="count"
            fill="#0a1128"
            radius={[0, 6, 6, 0]}
            maxBarSize={22}
            onClick={(entry) => handleReqClick(entry as unknown as RequirementItem)}
            className="cursor-pointer hover:opacity-85 transition-opacity"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
