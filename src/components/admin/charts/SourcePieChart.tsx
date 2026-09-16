"use client";

import React, { useSyncExternalStore } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
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

interface SourceItem {
  key: string;
  name: string;
  count: number;
  percentage: number;
}

interface SourcePieChartProps {
  data: SourceItem[];
}

const COLORS = [
  "#491612", // Primary brand maroon
  "#0a1128", // Accent navy
  "#e17076", // Harmonized soft rose
  "#64748b", // Slate
];

export default function SourcePieChart({ data }: SourcePieChartProps) {
  const router = useRouter();
  const mounted = useIsMounted();

  const handleSliceClick = (entry: SourceItem) => {
    if (entry && entry.key) {
      router.push(`/admin/leads?source=${entry.key}`);
    }
  };

  if (!mounted) {
    return (
      <div className="h-[260px] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const hasData = data && data.some((d) => d.count > 0);

  if (!hasData) {
    return (
      <div className="h-[260px] flex flex-col items-center justify-center text-slate-400 font-body text-xs">
        No source breakdown data available
      </div>
    );
  }

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={52}
            outerRadius={80}
            paddingAngle={3}
            dataKey="count"
            onClick={(entry) => handleSliceClick(entry as unknown as SourceItem)}
            className="cursor-pointer hover:opacity-90 transition-opacity"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="transparent"
                className="cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: "12px",
              boxShadow: "0 4px 20px -2px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "12px",
            }}
            formatter={(value: unknown, name: unknown, item: { payload?: { percentage?: number } }) => [
              `${String(value)} inquiries (${item?.payload?.percentage ?? 0}%)`,
              String(name),
            ]}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span className="font-body text-xs text-slate-600 ml-1 mr-2">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
