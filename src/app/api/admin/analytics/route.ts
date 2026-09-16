import { NextResponse } from "next/server";
import {
  getSupabaseServerClient,
  isSupabaseConfigured,
  LeadStatus,
  LeadSource,
  Lead,
} from "@/lib/supabaseServer";
import { getMockLeads } from "@/lib/mockLeads";
import { authenticateAdminRequest } from "@/lib/adminAuth";

// Requirement display label mapping
const REQUIREMENT_LABELS: Record<string, string> = {
  "1bhk": "1 BHK",
  "2bhk": "2 BHK",
  "3bhk": "3 BHK",
  "other": "Other Services",
  "Property Buying": "Property Buying",
  "Property Selling": "Property Selling",
  "Property Renting": "Property Renting",
  "Property Consultation": "Consultation",
  "Interior Design": "Interior Design",
  "Invisible Grills": "Invisible Grills",
  "Commercial Buy/Sell": "Commercial Buy/Sell",
  "Commercial Rental": "Commercial Rental",
};

import { getCachedAnalytics, setCachedAnalytics } from "@/lib/analyticsCache";

export async function GET(request: Request) {
  try {
    if (!(await authenticateAdminRequest(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Invalid or missing Admin Passcode." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const forceRefresh = searchParams.get("refresh") === "true";

    // Serve from cache if fresh and no forced refresh
    const cachedData = !forceRefresh ? getCachedAnalytics() : null;
    if (cachedData) {
      return NextResponse.json(
        {
          success: true,
          cached: true,
          data: cachedData,
        },
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            "X-Cache": "HIT",
          },
        }
      );
    }

    // Dev/Preview Mode when Supabase credentials are not connected
    if (!isSupabaseConfigured()) {
      const mockLeads = getMockLeads();
      const totalLeads = mockLeads.length;
      const newLeads = mockLeads.filter((l) => l.status === "new").length;
      const convertedLeads = mockLeads.filter((l) => l.status === "converted").length;
      const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : "0.0";

      // Status breakdown
      const statuses: LeadStatus[] = ["new", "contacted", "qualified", "converted", "closed"];
      const statusCounts = statuses.map((status) => ({
        status,
        label: status.charAt(0).toUpperCase() + status.slice(1),
        count: mockLeads.filter((l) => l.status === status).length,
      }));

      // Source breakdown
      const sources: { key: LeadSource; label: string }[] = [
        { key: "modal", label: "Consultation Modal" },
        { key: "contact_page", label: "Contact Page" },
        { key: "website", label: "Website Organic" },
      ];
      const sourceCounts = sources.map(({ key, label }) => {
        const count = mockLeads.filter((l) => l.source === key).length;
        return {
          key,
          name: label,
          count,
          percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
        };
      });

      // Requirement breakdown
      const reqMap: Record<string, number> = {};
      mockLeads.forEach((l) => {
        const key = REQUIREMENT_LABELS[l.requirement] || l.requirement;
        reqMap[key] = (reqMap[key] || 0) + 1;
      });
      const requirementCounts = Object.entries(reqMap)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);

      // Last 30 days time series
      const daysMap: Record<string, number> = {};
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const dateKey = d.toISOString().split("T")[0];
        daysMap[dateKey] = 0;
      }
      mockLeads.forEach((l) => {
        const dateKey = l.created_at.split("T")[0];
        if (daysMap[dateKey] !== undefined) {
          daysMap[dateKey]++;
        }
      });
      const timeSeries = Object.entries(daysMap).map(([date, count]) => {
        const d = new Date(date);
        return {
          date,
          label: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
          count,
        };
      });

      // Recent leads (top 10)
      const recentLeads = [...mockLeads]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10);

      const previewData = {
        kpis: {
          totalLeads,
          newLeads,
          convertedLeads,
          conversionRate: Number(conversionRate),
          trend: "+14% this month",
        },
        statusCounts,
        sourceCounts,
        requirementCounts,
        timeSeries,
        recentLeads,
      };

      setCachedAnalytics(previewData);

      return NextResponse.json({
        success: true,
        devMode: true,
        data: previewData,
      });
    }

    // Live Supabase Parallel Execution
    const supabase = getSupabaseServerClient();
    const statuses: LeadStatus[] = ["new", "contacted", "qualified", "converted", "closed"];
    const sources: { key: LeadSource; label: string }[] = [
      { key: "modal", label: "Consultation Modal" },
      { key: "contact_page", label: "Contact Page" },
      { key: "website", label: "Website Organic" },
    ];

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Run ALL 6 database operations concurrently using Promise.all
    const [
      totalLeadsResult,
      statusCounts,
      sourceRawCounts,
      trendResult,
      reqCountsResult,
      recentLeadsResult,
    ] = await Promise.all([
      // 1. Total leads exact count (HEAD - no rows transferred)
      supabase.from("leads").select("*", { count: "exact", head: true }),

      // 2. Status counts in parallel (HEAD - no rows transferred)
      Promise.all(
        statuses.map(async (status) => {
          const { count } = await supabase
            .from("leads")
            .select("*", { count: "exact", head: true })
            .eq("status", status);
          return {
            status,
            label: status.charAt(0).toUpperCase() + status.slice(1),
            count: count || 0,
          };
        })
      ),

      // 3. Source counts in parallel (HEAD - no rows transferred)
      Promise.all(
        sources.map(async ({ key, label }) => {
          const { count } = await supabase
            .from("leads")
            .select("*", { count: "exact", head: true })
            .eq("source", key);
          return {
            key,
            name: label,
            count: count || 0,
          };
        })
      ),

      // 4. 30-Day Trend: Try PostgreSQL RPC first; fallback to date-filtered query
      supabase.rpc("get_leads_30day_trend").then(async (rpcRes) => {
        if (!rpcRes.error && rpcRes.data && Array.isArray(rpcRes.data) && rpcRes.data.length > 0) {
          return { type: "rpc", data: rpcRes.data };
        }
        // Fallback: minimal columns
        const { data } = await supabase
          .from("leads")
          .select("created_at")
          .gte("created_at", thirtyDaysAgo.toISOString());
        return { type: "fallback", data: data || [] };
      }),

      // 5. Requirement Breakdown: Try PostgreSQL RPC first; fallback to query
      supabase.rpc("get_leads_requirement_counts").then(async (rpcRes) => {
        if (!rpcRes.error && rpcRes.data && Array.isArray(rpcRes.data) && rpcRes.data.length > 0) {
          return { type: "rpc", data: rpcRes.data };
        }
        // Fallback: minimal columns
        const { data } = await supabase
          .from("leads")
          .select("requirement")
          .gte("created_at", thirtyDaysAgo.toISOString());
        return { type: "fallback", data: data || [] };
      }),

      // 6. Recent 10 leads (Selective projection, omit heavy unneeded fields)
      supabase
        .from("leads")
        .select("id, full_name, phone, requirement, price_range, property_stage, source, status, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const total = totalLeadsResult.count || 0;
    const newLeads = statusCounts.find((s) => s.status === "new")?.count || 0;
    const convertedLeads = statusCounts.find((s) => s.status === "converted")?.count || 0;
    const conversionRate = total > 0 ? Number(((convertedLeads / total) * 100).toFixed(1)) : 0;

    // Calculate source percentages
    const sourceCounts = sourceRawCounts.map((s) => ({
      ...s,
      percentage: total > 0 ? Math.round((s.count / total) * 100) : 0,
    }));

    // Process 30-day continuous time series
    const daysMap: Record<string, number> = {};
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateKey = d.toISOString().split("T")[0];
      daysMap[dateKey] = 0;
    }

    if (trendResult.type === "rpc") {
      trendResult.data.forEach((item: { date?: string; day?: string; count: string | number }) => {
        const key = (item.date || item.day || "").split("T")[0];
        if (key && daysMap[key] !== undefined) {
          daysMap[key] = Number(item.count) || 0;
        }
      });
    } else {
      // Fallback in-memory date bucketing
      (trendResult.data as { created_at: string }[]).forEach((r) => {
        const dateKey = r.created_at.split("T")[0];
        if (daysMap[dateKey] !== undefined) {
          daysMap[dateKey]++;
        }
      });
    }

    const timeSeries = Object.entries(daysMap).map(([date, count]) => {
      const d = new Date(date);
      return {
        date,
        label: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        count,
      };
    });

    // Process requirement counts
    const DEFAULT_REQUIREMENTS = [
      "1 BHK",
      "2 BHK",
      "3 BHK",
      "Property Buying",
      "Property Selling",
      "Property Renting",
      "Interior Design",
      "Invisible Grills",
    ];
    let requirementCounts: { label: string; count: number }[] = [];

    if (reqCountsResult.type === "rpc") {
      const rpcMap: Record<string, number> = {};
      DEFAULT_REQUIREMENTS.forEach((req) => {
        rpcMap[req] = 0;
      });
      (reqCountsResult.data as { requirement: string; count: string | number }[]).forEach((item) => {
        const label = REQUIREMENT_LABELS[item.requirement] || item.requirement;
        rpcMap[label] = Number(item.count) || 0;
      });
      requirementCounts = Object.entries(rpcMap)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);
    } else {
      const reqMap: Record<string, number> = {};
      DEFAULT_REQUIREMENTS.forEach((req) => {
        reqMap[req] = 0;
      });
      (reqCountsResult.data as { requirement: string }[]).forEach((r) => {
        const label = REQUIREMENT_LABELS[r.requirement] || r.requirement;
        reqMap[label] = (reqMap[label] || 0) + 1;
      });
      requirementCounts = Object.entries(reqMap)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);
    }

    const payload = {
      kpis: {
        totalLeads: total,
        newLeads,
        convertedLeads,
        conversionRate,
        trend: "+12% this month",
      },
      statusCounts,
      sourceCounts,
      requirementCounts,
      timeSeries,
      recentLeads: (recentLeadsResult.data as Lead[]) || [],
    };

    // Update in-memory cache
    setCachedAnalytics(payload);

    return NextResponse.json(
      {
        success: true,
        cached: false,
        data: payload,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          "X-Cache": "MISS",
        },
      }
    );
  } catch (err: unknown) {
    console.error("❌ [API /api/admin/analytics] Parallel fetch error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching analytics." },
      { status: 500 }
    );
  }
}
