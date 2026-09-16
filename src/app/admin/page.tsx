"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Clock,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  ArrowRight,
  Phone,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useAdminAuth } from "./AdminAuthContext";
import { Lead } from "@/lib/supabaseServer";
import { formatRelativeTime } from "@/lib/utils";
import StatusBadge from "@/components/admin/StatusBadge";
import SourcePieChart from "@/components/admin/charts/SourcePieChart";
import StatusStatusBarChart from "@/components/admin/charts/StatusStatusBarChart";
import LeadsOverTimeChart from "@/components/admin/charts/LeadsOverTimeChart";
import RequirementBarChart from "@/components/admin/charts/RequirementBarChart";

interface AnalyticsData {
  kpis: {
    totalLeads: number;
    newLeads: number;
    convertedLeads: number;
    conversionRate: number;
    trend: string;
  };
  statusCounts: { status: string; label: string; count: number }[];
  sourceCounts: { key: string; name: string; count: number; percentage: number }[];
  requirementCounts: { label: string; count: number }[];
  timeSeries: { date: string; label: string; count: number }[];
  recentLeads: Lead[];
}

export default function AdminDashboardPage() {
  const { passcode } = useAdminAuth();
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError("");

    try {
      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      const url = isManualRefresh ? "/api/admin/analytics?refresh=true" : "/api/admin/analytics";
      const res = await fetch(url, {
        headers: {
          "x-admin-passcode": activePasscode,
        },
      });

      const resData = await res.json();

      if (res.ok && resData.success) {
        setData(resData.data);
        setIsDevMode(Boolean(resData.devMode));
      } else {
        setError(resData.error || "Failed to load dashboard analytics.");
      }
    } catch (err) {
      console.error("Fetch analytics failed:", err);
      setError("Failed to communicate with analytics server.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [passcode]);

  useEffect(() => {
    let ignore = false;

    async function initLoad() {
      try {
        const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
        const res = await fetch("/api/admin/analytics", {
          headers: {
            "x-admin-passcode": activePasscode,
          },
        });
        const resData = await res.json();
        if (!ignore) {
          if (res.ok && resData.success) {
            setData(resData.data);
            setIsDevMode(Boolean(resData.devMode));
          } else {
            setError(resData.error || "Failed to load dashboard analytics.");
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Fetch analytics failed:", err);
          setError("Failed to communicate with analytics server.");
          setIsLoading(false);
        }
      }
    }

    initLoad();

    const handleFocus = () => {
      fetchAnalytics(false);
    };
    window.addEventListener("focus", handleFocus);
    return () => {
      ignore = true;
      window.removeEventListener("focus", handleFocus);
    };
  }, [passcode, fetchAnalytics]);

  return (
    <div className="space-y-8 pb-12">
      {/* ─── Top Header Bar ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900 leading-tight">
            Executive Dashboard
          </h1>
          <p className="font-body text-xs sm:text-sm text-slate-500 mt-1">
            Real-time inquiry metrics, conversion pipeline, and property service demand.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => fetchAnalytics(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-heading font-semibold text-xs text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand-600" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh Data"}</span>
          </button>
        </div>
      </div>

      {/* Dev/Preview Notice if applicable */}
      {isDevMode && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs sm:text-sm font-body">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-heading font-semibold">Preview / Offline Demo Mode:</span> Supabase live credentials are not yet connected in <code className="bg-amber-100/70 px-1.5 py-0.5 rounded text-amber-950 font-mono text-xs">.env.local</code>. Showing simulated pipeline metrics with full interactive capabilities.
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-body">
          {error}
        </div>
      )}

      {/* ─── STEP 3: Top Row — 4 Stat Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Leads */}
        <Link
          href="/admin/leads"
          className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 block group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:scale-105 transition-transform">
              <Users className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <span className="text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wider">
              All-Time
            </span>
          </div>
          <div>
            <div className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
              {isLoading ? (
                <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse my-0.5" />
              ) : (
                data?.kpis.totalLeads ?? 0
              )}
            </div>
            <p className="font-body text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              Total Inquiries
            </p>
            <div className="mt-3 flex items-center justify-between text-xs font-heading font-semibold">
              {isLoading ? (
                <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
              ) : (
                <span className="text-emerald-600">{data?.kpis.trend || "+12% this month"}</span>
              )}
              <span className="text-slate-400 group-hover:text-brand-600 font-medium text-[11px] flex items-center gap-0.5 transition-colors">
                View leads <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </Link>

        {/* New Leads */}
        <Link
          href="/admin/leads?status=new"
          className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 block group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <span className="text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 uppercase tracking-wider">
              Pending
            </span>
          </div>
          <div>
            <div className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
              {isLoading ? (
                <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse my-0.5" />
              ) : (
                data?.kpis.newLeads ?? 0
              )}
            </div>
            <p className="font-body text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              New Leads
            </p>
            <div className="mt-3 flex items-center justify-between text-xs font-heading font-semibold">
              {isLoading ? (
                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
              ) : (
                <span className="text-blue-600">Requires follow-up</span>
              )}
              <span className="text-slate-400 group-hover:text-blue-600 font-medium text-[11px] flex items-center gap-0.5 transition-colors">
                Filter new <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </Link>

        {/* Converted Leads */}
        <Link
          href="/admin/leads?status=converted"
          className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 block group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
              <CheckCircle2 className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <span className="text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 uppercase tracking-wider">
              Won Deals
            </span>
          </div>
          <div>
            <div className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
              {isLoading ? (
                <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse my-0.5" />
              ) : (
                data?.kpis.convertedLeads ?? 0
              )}
            </div>
            <p className="font-body text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              Converted Clients
            </p>
            <div className="mt-3 flex items-center justify-between text-xs font-heading font-semibold">
              {isLoading ? (
                <div className="h-4 w-28 bg-slate-100 rounded animate-pulse" />
              ) : (
                <span className="text-emerald-600">Successful closures</span>
              )}
              <span className="text-slate-400 group-hover:text-emerald-700 font-medium text-[11px] flex items-center gap-0.5 transition-colors">
                View won <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </Link>

        {/* Conversion Rate */}
        <Link
          href="/admin/leads?status=converted"
          className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/60 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 block group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" strokeWidth={1.75} />
            </div>
            <span className="text-[11px] font-heading font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 uppercase tracking-wider">
              Efficiency
            </span>
          </div>
          <div>
            <div className="font-heading text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
              {isLoading ? (
                <div className="h-9 w-20 bg-slate-100 rounded-lg animate-pulse my-0.5" />
              ) : (
                `${data?.kpis.conversionRate ?? 0}%`
              )}
            </div>
            <p className="font-body text-xs sm:text-sm text-slate-500 mt-2 font-medium">
              Conversion Rate
            </p>
            <div className="mt-3 flex items-center justify-between text-xs font-heading font-semibold">
              {isLoading ? (
                <div className="h-4 w-32 bg-slate-100 rounded animate-pulse" />
              ) : (
                <span className="text-purple-600">High pipeline conversion</span>
              )}
              <span className="text-slate-400 group-hover:text-purple-700 font-medium text-[11px] flex items-center gap-0.5 transition-colors">
                Analyze <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* ─── STEP 3: Charts Row (2x2 Grid) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Leads by Source */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/60 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-slate-900 tracking-tight">
                Leads by Source
              </h2>
              <span className="text-[11px] font-heading font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Click slices to filter
              </span>
            </div>
            <p className="font-body text-xs text-slate-500 mt-0.5">
              Breakdown across consultation modal, contact page, and organic web inquiry.
            </p>
          </div>
          {isLoading ? (
            <div className="h-[260px] w-full flex flex-col justify-center items-center gap-3">
              <div className="w-40 h-40 rounded-full border-[18px] border-slate-100 animate-pulse" />
              <div className="w-1/2 h-3 bg-slate-100 rounded animate-pulse" />
            </div>
          ) : (
            <SourcePieChart data={data?.sourceCounts || []} />
          )}
        </div>

        {/* Chart 2: Leads by Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/60 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-slate-900 tracking-tight">
                Leads by Pipeline Status
              </h2>
              <span className="text-[11px] font-heading font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Click bars to filter
              </span>
            </div>
            <p className="font-body text-xs text-slate-500 mt-0.5">
              Distribution across new, contacted, qualified, converted, and closed stages.
            </p>
          </div>
          {isLoading ? (
            <div className="h-[260px] w-full flex items-end justify-between gap-4 p-4">
              <div className="w-1/5 h-28 bg-slate-100 rounded-t-lg animate-pulse" />
              <div className="w-1/5 h-44 bg-slate-100 rounded-t-lg animate-pulse" />
              <div className="w-1/5 h-36 bg-slate-100 rounded-t-lg animate-pulse" />
              <div className="w-1/5 h-20 bg-slate-100 rounded-t-lg animate-pulse" />
              <div className="w-1/5 h-14 bg-slate-100 rounded-t-lg animate-pulse" />
            </div>
          ) : (
            <StatusStatusBarChart data={data?.statusCounts || []} />
          )}
        </div>

        {/* Chart 3: Leads Over Time */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/60 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-slate-900 tracking-tight">
                Leads Over Time
              </h2>
              <span className="text-[11px] font-heading font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Click point to filter date
              </span>
            </div>
            <p className="font-body text-xs text-slate-500 mt-0.5">
              Daily inquiry trajectory and volume trends across the website.
            </p>
          </div>
          {isLoading ? (
            <div className="h-[260px] w-full flex items-end justify-between gap-2 p-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-slate-100 rounded-t animate-pulse"
                  style={{ height: `${20 + ((i * 17) % 70)}%` }}
                />
              ))}
            </div>
          ) : (
            <LeadsOverTimeChart data={data?.timeSeries || []} />
          )}
        </div>

        {/* Chart 4: Leads by Requirement Type */}
        <div className="bg-white rounded-2xl p-6 shadow-sm ring-1 ring-slate-200/60 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-bold text-base text-slate-900 tracking-tight">
                Leads by Requirement Type
              </h2>
              <span className="text-[11px] font-heading font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                Click bars to filter
              </span>
            </div>
            <p className="font-body text-xs text-slate-500 mt-0.5">
              Identifies top customer interest across buying, renting, interior design, and grills.
            </p>
          </div>
          {isLoading ? (
            <div className="h-[260px] w-full flex flex-col justify-center gap-4 p-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                  <div
                    className="h-5 bg-slate-100 rounded-lg animate-pulse"
                    style={{ width: `${80 - i * 18}%` }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <RequirementBarChart data={data?.requirementCounts || []} />
          )}
        </div>
      </div>

      {/* ─── STEP 3: Recent Leads Section ─── */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900 tracking-tight">
              Recent Leads
            </h2>
            <p className="font-body text-xs text-slate-500 mt-0.5">
              Latest inquiries submitted across PM Properties touchpoints.
            </p>
          </div>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 font-heading text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Lead / Contact</th>
                  <th className="py-3 px-5">Requirement</th>
                  <th className="py-3 px-5">Source</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Time</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="py-3.5 px-5">
                      <div className="h-4 w-32 bg-slate-200/80 rounded mb-1.5" />
                      <div className="h-3 w-20 bg-slate-100 rounded" />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="h-6 w-24 bg-slate-100 rounded-lg" />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="h-4 w-20 bg-slate-100 rounded" />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="h-6 w-20 bg-slate-100 rounded-full" />
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="h-3 w-16 bg-slate-100 rounded" />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="h-6 w-16 bg-slate-100 rounded-lg ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : !data?.recentLeads || data.recentLeads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 font-body text-xs">
            No leads recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-body border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 font-heading text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-5">Lead / Contact</th>
                  <th className="py-3 px-5">Requirement</th>
                  <th className="py-3 px-5">Source</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Time</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {data.recentLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => router.push(`/admin/leads?id=${lead.id}`)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    <td className="py-3.5 px-5">
                      <div className="font-heading font-semibold text-slate-900 text-sm group-hover:text-brand-700 transition-colors">
                        {lead.full_name}
                      </div>
                      <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 font-medium text-slate-800">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-heading text-[11px] font-medium">
                        {lead.requirement}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 capitalize text-slate-500">
                      {lead.source.replace("_", " ")}
                    </td>
                    <td className="py-3.5 px-5">
                      <StatusBadge status={lead.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-5 text-slate-400 whitespace-nowrap">
                      {formatRelativeTime(lead.created_at)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-heading font-semibold text-slate-600 group-hover:text-brand-600 transition-colors p-1.5 rounded-lg group-hover:bg-brand-50">
                        <span>Manage</span>
                        <ExternalLink className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
