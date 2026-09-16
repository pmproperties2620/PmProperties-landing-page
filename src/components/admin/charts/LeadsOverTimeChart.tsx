"use client";

import React, { useSyncExternalStore } from "react";
import {
  AreaChart,
  Area,
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

interface TimeSeriesItem {
  date: string;
  label: string;
  count: number;
}

interface LeadsOverTimeChartProps {
  data: TimeSeriesItem[];
}

export default function LeadsOverTimeChart({ data }: LeadsOverTimeChartProps) {
  const router = useRouter();
  const mounted = useIsMounted();

  const handleChartClick = (state: { activePayload?: Array<{ payload?: TimeSeriesItem }> }) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const item = state.activePayload[0].payload;
      if (item && item.date) {
        router.push(`/admin/leads?startDate=${item.date}&endDate=${item.date}`);
      }
    }
  };

  if (!mounted) {
    return (
      <div className="h-[260px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Show every 5th or 6th tick label so X-axis isn't crowded
  const sampledData = data || [];

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={sampledData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          onClick={(state) => handleChartClick(state as unknown as { activePayload?: Array<{ payload?: TimeSeriesItem }> })}
          className="cursor-pointer"
        >
          <defs>
            <linearGradient id="maroonGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#491612" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#491612" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            interval={4}
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
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 20px -2px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "12px",
            }}
            formatter={(value: unknown) => [`${String(value)} leads (click to filter)`, "New Inquiries"]}
            labelFormatter={(label) => `Date: ${String(label)}`}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#491612"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#maroonGradient)"
            dot={{ r: 2, fill: "#491612", strokeWidth: 0 }}
            activeDot={{ r: 6, fill: "#491612", stroke: "#ffffff", strokeWidth: 2, className: "cursor-pointer" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
