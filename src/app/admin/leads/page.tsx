"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search,
  RefreshCw,
  Phone,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
} from "lucide-react";
import { useAdminAuth } from "../AdminAuthContext";
import { usePushNotifications } from "@/context/PushNotificationContext";
import { Lead, LeadStatus } from "@/lib/supabaseServer";
import { formatDate, formatRelativeTime } from "@/lib/utils";
import StatusBadge from "@/components/admin/StatusBadge";

function LeadsManagementContent() {
  const { passcode } = useAdminAuth();
  const { refreshUnreadCount, setUnreadCount } = usePushNotifications();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Filters derived directly from URL searchParams (single source of truth)
  const selectedStatus = searchParams.get("status") || "all";
  const selectedSource = searchParams.get("source") || "all";
  const selectedRequirement = searchParams.get("requirement") || "all";
  const urlSearch = searchParams.get("search") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const initialLeadId = searchParams.get("id");
  const dateRangePreset =
    searchParams.get("preset") || (startDate || endDate ? "custom" : "all");

  // Local State for interactive inputs & pagination
  const [search, setSearch] = useState(urlSearch);
  const [page, setPage] = useState(1);
  const pageSize = 15;

  // Data State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [error, setError] = useState("");

  // Slide-over detail drawer state
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editingNotes, setEditingNotes] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    setPage(1);
    router.replace(`/admin/leads?${params.toString()}`);
  };

  const handleDatePresetChange = (preset: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];

    if (preset === "all") {
      params.delete("preset");
      params.delete("startDate");
      params.delete("endDate");
    } else if (preset === "today") {
      params.set("preset", "today");
      params.set("startDate", todayStr);
      params.set("endDate", todayStr);
    } else if (preset === "yesterday") {
      const y = new Date();
      y.setDate(y.getDate() - 1);
      const yStr = y.toISOString().split("T")[0];
      params.set("preset", "yesterday");
      params.set("startDate", yStr);
      params.set("endDate", yStr);
    } else if (preset === "7days") {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      params.set("preset", "7days");
      params.set("startDate", d.toISOString().split("T")[0]);
      params.set("endDate", todayStr);
    } else if (preset === "30days") {
      const d = new Date();
      d.setDate(d.getDate() - 30);
      params.set("preset", "30days");
      params.set("startDate", d.toISOString().split("T")[0]);
      params.set("endDate", todayStr);
    } else if (preset === "thisMonth") {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      params.set("preset", "thisMonth");
      params.set("startDate", firstDay);
      params.set("endDate", todayStr);
    } else if (preset === "custom") {
      params.set("preset", "custom");
    }
    setPage(1);
    router.replace(`/admin/leads?${params.toString()}`);
  };

  const handleDateSpanChange = (start: string, end: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("preset", "custom");
    if (start) params.set("startDate", start);
    else params.delete("startDate");
    if (end) params.set("endDate", end);
    else params.delete("endDate");
    params.delete("page");
    setPage(1);
    router.replace(`/admin/leads?${params.toString()}`);
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      const queryParams = new URLSearchParams({
        limit: "1000",
        status: selectedStatus,
        source: selectedSource,
        ...(selectedRequirement !== "all" && { requirement: selectedRequirement }),
        search: search.trim(),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const res = await fetch(`/api/admin/leads?${queryParams.toString()}`, {
        headers: {
          "x-admin-passcode": activePasscode,
        },
      });

      const data = await res.json();
      if (res.ok && data.success && data.leads) {
        const exportData = data.leads;
        if (exportData.length === 0) {
          alert("No leads found to export with the current filters.");
          return;
        }

        const headers = [
          "ID",
          "Full Name",
          "Phone",
          "Requirement",
          "Price Range",
          "Property Stage",
          "Source",
          "Status",
          "Notes",
          "Created At",
        ];

        const rows = exportData.map((l: Lead) => [
          l.id,
          `"${(l.full_name || "").replace(/"/g, '""')}"`,
          `"${l.phone || ""}"`,
          `"${(l.requirement || "").replace(/"/g, '""')}"`,
          `"${l.price_range ? `₹${l.price_range} Lakhs` : ""}"`,
          `"${(l.property_stage || "").replace(/_/g, " ")}"`,
          `"${l.source || ""}"`,
          `"${l.status || ""}"`,
          `"${(l.notes || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
          `"${l.created_at || ""}"`,
        ]);

        const csvContent =
          "data:text/csv;charset=utf-8," +
          [headers.join(","), ...rows.map((e: (string | number)[]) => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
          "download",
          `pm_properties_leads_${new Date().toISOString().split("T")[0]}.csv`
        );
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert(data.error || "Failed to export leads.");
      }
    } catch (err) {
      console.error("Export CSV error:", err);
      alert("Failed to export leads.");
    } finally {
      setIsExporting(false);
    }
  };

  const fetchLeads = useCallback(
    async (isManual = false) => {
      if (isManual) setIsRefreshing(true);
      else setIsLoading(true);
      setError("");

      try {
        const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
          status: selectedStatus,
          source: selectedSource,
          ...(selectedRequirement !== "all" && { requirement: selectedRequirement }),
          search: search.trim(),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        });

        const res = await fetch(`/api/admin/leads?${queryParams.toString()}`, {
          headers: {
            "x-admin-passcode": activePasscode,
          },
        });

        const data = await res.json();

        if (res.ok && data.success) {
          setLeads(data.leads || []);
          setTotalLeads(data.total || 0);
          setTotalPages(data.totalPages || 1);
          setIsDevMode(Boolean(data.devMode));
        } else {
          setError(data.error || "Failed to fetch leads.");
        }
      } catch (err) {
        console.error("Failed to fetch leads:", err);
        setError("Error connecting to server.");
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [passcode, page, pageSize, selectedStatus, selectedSource, selectedRequirement, search, startDate, endDate]
  );

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
          status: selectedStatus,
          source: selectedSource,
          ...(selectedRequirement !== "all" && { requirement: selectedRequirement }),
          search: search.trim(),
          ...(startDate && { startDate }),
          ...(endDate && { endDate }),
        });

        const res = await fetch(`/api/admin/leads?${queryParams.toString()}`, {
          headers: {
            "x-admin-passcode": activePasscode,
          },
        });

        const data = await res.json();

        if (!ignore) {
          if (res.ok && data.success) {
            setLeads(data.leads || []);
            setTotalLeads(data.total || 0);
            setTotalPages(data.totalPages || 1);
            setIsDevMode(Boolean(data.devMode));

            // If initial lead ID was in URL query params, select it or fetch it directly
            if (initialLeadId) {
              const found = data.leads?.find((l: Lead) => l.id === initialLeadId);
              if (found) {
                setSelectedLead(found);
                setEditingNotes(found.notes || "");
              } else {
                fetch(`/api/admin/leads?id=${initialLeadId}`, {
                  headers: { "x-admin-passcode": activePasscode },
                })
                  .then((r) => r.json())
                  .then((d) => {
                    if (!ignore && d.success && d.leads?.[0]) {
                      setSelectedLead(d.leads[0]);
                      setEditingNotes(d.leads[0].notes || "");
                    }
                  })
                  .catch(() => {});
              }
            }
          } else {
            setError(data.error || "Failed to fetch leads.");
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Failed to fetch leads:", err);
          setError("Error connecting to server.");
          setIsLoading(false);
        }
      }
    }

    loadData();

    const onFocus = () => {
      fetchLeads(false);
    };
    window.addEventListener("focus", onFocus);
    return () => {
      ignore = true;
      window.removeEventListener("focus", onFocus);
    };
  }, [passcode, page, pageSize, selectedStatus, selectedSource, selectedRequirement, search, startDate, endDate, initialLeadId, fetchLeads]);

  // Handle row click to open detail drawer
  const handleOpenDrawer = (lead: Lead) => {
    setSelectedLead(lead);
    setEditingNotes(lead.notes || "");
    setSaveSuccessMsg("");

    // If lead is unread, automatically mark as read
    if (lead.is_read === false || (lead.status === "new" && lead.is_read === undefined)) {
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, is_read: true } : l))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": activePasscode,
        },
        body: JSON.stringify({ id: lead.id, is_read: true }),
      })
        .then(() => refreshUnreadCount())
        .catch(() => {});
    }
  };

  const handleCloseDrawer = () => {
    setSelectedLead(null);
    setEditingNotes("");
    setSaveSuccessMsg("");
  };

  // Update Status
  const handleUpdateStatus = async (newStatus: LeadStatus) => {
    if (!selectedLead) return;
    setIsUpdatingStatus(true);
    setSaveSuccessMsg("");

    try {
      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": activePasscode,
        },
        body: JSON.stringify({
          id: selectedLead.id,
          status: newStatus,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        const updated = {
          ...selectedLead,
          status: newStatus,
          updated_at: new Date().toISOString(),
        };
        setSelectedLead(updated);
        setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        setSaveSuccessMsg("Status updated successfully.");
        setTimeout(() => setSaveSuccessMsg(""), 3000);
      } else {
        alert(resData.error || "Failed to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Save Notes
  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setIsSavingNotes(true);
    setSaveSuccessMsg("");

    try {
      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": activePasscode,
        },
        body: JSON.stringify({
          id: selectedLead.id,
          notes: editingNotes,
        }),
      });

      const resData = await res.json();
      if (res.ok && resData.success) {
        const updated = {
          ...selectedLead,
          notes: editingNotes,
          updated_at: new Date().toISOString(),
        };
        setSelectedLead(updated);
        setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
        setSaveSuccessMsg("Notes saved successfully.");
        setTimeout(() => setSaveSuccessMsg(""), 3000);
      } else {
        alert(resData.error || "Failed to save notes.");
      }
    } catch (err) {
      console.error("Notes save error:", err);
      alert("Failed to save notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* ─── Header ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900 leading-tight">
            Leads Management
          </h1>
          <p className="font-body text-xs sm:text-sm text-slate-500 mt-1">
            Search, filter, track pipeline status, and log client consultation notes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting || isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-heading font-semibold text-xs text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
            title="Download leads as .csv file"
          >
            <Download className={`w-3.5 h-3.5 text-slate-500 ${isExporting ? "animate-bounce" : ""}`} />
            <span>{isExporting ? "Exporting..." : "Download .CSV"}</span>
          </button>

          <button
            type="button"
            onClick={() => fetchLeads(true)}
            disabled={isRefreshing || isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white font-heading font-semibold text-xs text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-brand-600" : ""}`} />
            <span>{isRefreshing ? "Refreshing..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {/* Dev/Preview Mode Notice */}
      {isDevMode && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs sm:text-sm font-body">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-heading font-semibold">Preview / Offline Demo Mode:</span> Connect Supabase credentials in <code className="bg-amber-100/70 px-1.5 py-0.5 rounded text-amber-950 font-mono text-xs">.env.local</code> to persist directly into PostgreSQL. Any updates made here are saved in local memory.
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-body">
          {error}
        </div>
      )}

      {/* ─── STEP 4: Filter Bar on Top ─── */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm ring-1 ring-slate-200/60 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="lg:col-span-3 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white font-body text-xs sm:text-sm placeholder:text-slate-400 text-slate-900 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedStatus}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-body text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Source Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedSource}
              onChange={(e) => handleFilterChange("source", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-body text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all"
            >
              <option value="all">All Sources</option>
              <option value="modal">Modal</option>
              <option value="contact_page">Contact Page</option>
              <option value="website">Website</option>
            </select>
          </div>

          {/* Requirement Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedRequirement}
              onChange={(e) => handleFilterChange("requirement", e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white font-body text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all"
            >
              <option value="all">All Services</option>
              <option value="1bhk">1 BHK</option>
              <option value="2bhk">2 BHK</option>
              <option value="3bhk">3 BHK</option>
              <option value="Property Buying">Property Buying</option>
              <option value="Property Selling">Property Selling</option>
              <option value="Property Renting">Property Renting</option>
              <option value="Interior Design">Interior Design</option>
              <option value="Invisible Grills">Invisible Grills</option>
            </select>
          </div>

          {/* Date Range Preset Selector */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={dateRangePreset}
                onChange={(e) => handleDatePresetChange(e.target.value)}
                className="w-full pl-8 pr-2 py-2.5 rounded-xl border border-slate-200 bg-white font-body text-xs sm:text-sm text-slate-700 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="thisMonth">This Month</option>
                <option value="custom">Custom Range...</option>
              </select>
            </div>
          </div>

          {/* Reset Filters */}
          <div className="lg:col-span-1 flex items-center">
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
                router.replace("/admin/leads");
              }}
              className="w-full py-2.5 px-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-heading font-semibold text-xs text-center transition-colors cursor-pointer"
              title="Reset all filters"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Custom Date Range Pickers (shown when Custom is selected or dates are manually entered) */}
        {dateRangePreset === "custom" && (
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-heading font-semibold text-slate-600 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600" />
                <span>Date Span:</span>
              </span>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => handleDateSpanChange(e.target.value, endDate)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-body text-xs text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => handleDateSpanChange(startDate, e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-body text-xs text-slate-800 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
                />
              </div>
            </div>

            {(startDate || endDate) && (
              <button
                type="button"
                onClick={() => handleDatePresetChange("all")}
                className="text-xs font-heading font-medium text-rose-600 hover:text-rose-700 py-1"
              >
                Clear date span
              </button>
            )}
          </div>
        )}

        {/* Active Filters Bar */}
        {(selectedStatus !== "all" ||
          selectedSource !== "all" ||
          selectedRequirement !== "all" ||
          dateRangePreset !== "all" ||
          startDate !== "" ||
          endDate !== "" ||
          search.trim() !== "") && (
          <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs text-slate-500">
            <span className="font-heading font-semibold text-slate-700">Active Filters:</span>
            {selectedStatus !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-heading font-semibold text-[11px]">
                Status: {selectedStatus.charAt(0).toUpperCase() + selectedStatus.slice(1)}
                <button
                  type="button"
                  onClick={() => handleFilterChange("status", "all")}
                  className="hover:text-blue-900 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedSource !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-heading font-semibold text-[11px]">
                Source: {selectedSource.replace("_", " ")}
                <button
                  type="button"
                  onClick={() => handleFilterChange("source", "all")}
                  className="hover:text-purple-900 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedRequirement !== "all" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-heading font-semibold text-[11px]">
                Demand: {selectedRequirement}
                <button
                  type="button"
                  onClick={() => handleFilterChange("requirement", "all")}
                  className="hover:text-amber-950 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {search.trim() !== "" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-heading font-semibold text-[11px]">
                Search: &quot;{search}&quot;
                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                  className="hover:text-slate-900 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {(dateRangePreset !== "all" || startDate || endDate) && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 font-heading font-semibold text-[11px]">
                Date: {startDate && endDate ? (startDate === endDate ? startDate : `${startDate} to ${endDate}`) : dateRangePreset}
                <button
                  type="button"
                  onClick={() => handleDatePresetChange("all")}
                  className="hover:text-brand-950 ml-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setPage(1);
                router.replace("/admin/leads");
              }}
              className="text-xs font-heading font-medium text-rose-600 hover:text-rose-700 underline underline-offset-2 ml-auto cursor-pointer"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* ─── STEP 4: Full Data Table ─── */}
      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200/60 overflow-hidden">
        {isLoading ? (
          <>
            {/* Desktop Skeleton Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-body border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 font-heading text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Lead / Contact</th>
                    <th className="py-3.5 px-5">Requirement</th>
                    <th className="py-3.5 px-5">Budget Range</th>
                    <th className="py-3.5 px-5">Stage</th>
                    <th className="py-3.5 px-5">Source</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse">
                      <td className="py-4 px-5">
                        <div className="h-4 w-36 bg-slate-200/80 rounded mb-1.5" />
                        <div className="h-3 w-24 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-6 w-24 bg-slate-100 rounded-lg" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-4 w-16 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-4 w-20 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-4 w-20 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-6 w-20 bg-slate-100 rounded-full" />
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-3 w-16 bg-slate-100 rounded" />
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="h-7 w-20 bg-slate-100 rounded-lg ml-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Skeleton Cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="p-4 space-y-3 animate-pulse">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="h-4 w-32 bg-slate-200/80 rounded mb-1.5" />
                      <div className="h-3 w-20 bg-slate-100 rounded" />
                    </div>
                    <div className="h-5 w-16 bg-slate-100 rounded-full" />
                  </div>
                  <div className="flex gap-2">
                    <div className="h-5 w-20 bg-slate-100 rounded-md" />
                    <div className="h-5 w-16 bg-slate-100 rounded-md" />
                  </div>
                  <div className="flex justify-between pt-1 border-t border-slate-50">
                    <div className="h-3 w-16 bg-slate-100 rounded" />
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : leads.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 mx-auto flex items-center justify-center text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-slate-800 text-sm">No leads matched your criteria</h3>
            <p className="font-body text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try adjusting your search keywords, status filter, or source dropdown.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Full Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs font-body border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 font-heading text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                    <th className="py-3.5 px-5">Lead / Contact</th>
                    <th className="py-3.5 px-5">Requirement</th>
                    <th className="py-3.5 px-5">Budget Range</th>
                    <th className="py-3.5 px-5">Stage</th>
                    <th className="py-3.5 px-5">Source</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {leads.map((lead) => (
                    <tr
                      key={lead.id}
                      onClick={() => handleOpenDrawer(lead)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-2">
                          <div className="font-heading font-semibold text-slate-900 text-sm group-hover:text-brand-600 transition-colors">
                            {lead.full_name}
                          </div>
                          {(lead.is_read === false || (lead.status === "new" && lead.is_read === undefined)) && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-rose-50 text-rose-600 ring-1 ring-rose-200/80">
                              New
                            </span>
                          )}
                        </div>
                        <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5 font-mono">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{lead.phone}</span>
                        </div>
                      </td>
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-heading text-[11px] font-medium">
                          {lead.requirement}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-medium text-slate-800">
                        {lead.price_range ? `₹${lead.price_range} Lakhs` : "—"}
                      </td>
                      <td className="py-4 px-5 text-slate-600 capitalize">
                        {lead.property_stage ? lead.property_stage.replace(/_/g, " ") : "—"}
                      </td>
                      <td className="py-4 px-5 capitalize text-slate-500">
                        {lead.source.replace("_", " ")}
                      </td>
                      <td className="py-4 px-5">
                        <StatusBadge status={lead.status} size="sm" />
                      </td>
                      <td className="py-4 px-5 text-slate-400 whitespace-nowrap">
                        <div>{formatDate(lead.created_at)}</div>
                        <div className="text-[10px] text-slate-400">{formatRelativeTime(lead.created_at)}</div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDrawer(lead);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-heading font-semibold text-brand-600 hover:text-brand-700 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <span>Manage</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden divide-y divide-slate-100">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => handleOpenDrawer(lead)}
                  className="p-4 hover:bg-slate-50 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-heading font-semibold text-slate-900 text-base">
                          {lead.full_name}
                        </h4>
                        {(lead.is_read === false || (lead.status === "new" && lead.is_read === undefined)) && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-heading font-bold bg-rose-50 text-rose-600 ring-1 ring-rose-200/80">
                            New
                          </span>
                        )}
                      </div>
                      <div className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                    <StatusBadge status={lead.status} size="sm" />
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium">
                      {lead.requirement}
                    </span>
                    {lead.price_range && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        ₹{lead.price_range}L
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 capitalize">
                      {lead.source.replace("_", " ")}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400 border-t border-slate-50">
                    <span>{formatRelativeTime(lead.created_at)}</span>
                    <span className="font-heading font-semibold text-brand-600 flex items-center gap-1">
                      Details & Notes →
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── STEP 4: Pagination Bar ─── */}
            <div className="p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-body">
                Showing <span className="font-semibold text-slate-800">{leads.length > 0 ? (page - 1) * pageSize + 1 : 0}</span> to{" "}
                <span className="font-semibold text-slate-800">{Math.min(page * pageSize, totalLeads)}</span> of{" "}
                <span className="font-semibold text-slate-800">{totalLeads}</span> leads
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-heading font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <div className="text-xs font-heading font-medium text-slate-600 px-2">
                  Page {page} of {totalPages}
                </div>

                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-heading font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ─── STEP 4: Side Panel / Slide-Over Lead Detail Drawer ─── */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={handleCloseDrawer}
          />

          {/* Slide-over panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl z-10 flex flex-col overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <StatusBadge status={selectedLead.status} size="sm" />
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {selectedLead.id.slice(0, 8)}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900 tracking-tight">
                  {selectedLead.full_name}
                </h3>
                <p className="font-body text-xs text-slate-500 mt-0.5">
                  Submitted {formatDate(selectedLead.created_at)} ({formatRelativeTime(selectedLead.created_at)})
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1">
              {/* Quick Contact Actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-900 text-white font-heading font-semibold text-xs hover:bg-slate-800 transition-all shadow-xs"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedLead.phone}</span>
                </a>

                <a
                  href={`https://wa.me/91${selectedLead.phone}?text=${encodeURIComponent(
                    `Hello ${selectedLead.full_name}, thank you for reaching out to PM Properties regarding ${selectedLead.requirement}. I am contacting you to discuss your property requirements.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#075E54] text-white font-heading font-semibold text-xs hover:bg-[#075E54]/90 transition-all shadow-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              {/* Inquiry Specifications */}
              <div>
                <h4 className="font-heading font-semibold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Inquiry Specifications
                </h4>
                <div className="grid grid-cols-2 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Requirement</span>
                    <span className="font-heading font-semibold text-slate-800 text-sm">
                      {selectedLead.requirement}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Budget Range</span>
                    <span className="font-heading font-semibold text-slate-800 text-sm">
                      {selectedLead.price_range ? `₹${selectedLead.price_range} Lakhs` : "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Property Stage</span>
                    <span className="font-heading font-semibold text-slate-800 capitalize">
                      {selectedLead.property_stage ? selectedLead.property_stage.replace(/_/g, " ") : "Not specified"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Lead Source</span>
                    <span className="font-heading font-semibold text-slate-800 capitalize">
                      {selectedLead.source.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div>
                <label className="font-heading font-semibold text-xs uppercase tracking-wider text-slate-400 block mb-2">
                  Update Lead Pipeline Status
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleUpdateStatus(e.target.value as LeadStatus)}
                    disabled={isUpdatingStatus}
                    className="flex-1 py-2.5 px-3.5 rounded-xl border border-slate-200 bg-white font-body text-xs sm:text-sm text-slate-800 font-medium focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20"
                  >
                    <option value="new">New (Uncontacted)</option>
                    <option value="contacted">Contacted (In Discussion)</option>
                    <option value="qualified">Qualified (Site Visit / Budget Aligned)</option>
                    <option value="converted">Converted (Deal Closed / Token Given)</option>
                    <option value="closed">Closed (Lost / Unqualified)</option>
                  </select>
                  {isUpdatingStatus && (
                    <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </div>

              {/* Consultation Notes Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-heading font-semibold text-xs uppercase tracking-wider text-slate-400">
                    Consultation & Follow-Up Notes
                  </label>
                  {selectedLead.updated_at && (
                    <span className="text-[10px] text-slate-400">
                      Last edited {formatRelativeTime(selectedLead.updated_at)}
                    </span>
                  )}
                </div>
                <textarea
                  rows={5}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Record client preferences, preferred site visit timings, budget flexibilities, loan pre-approvals..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 bg-white font-body text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20 transition-all resize-none"
                />

                <div className="mt-3 flex items-center justify-between">
                  {saveSuccessMsg ? (
                    <span className="text-xs text-emerald-600 font-heading font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {saveSuccessMsg}
                    </span>
                  ) : <span />}

                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    disabled={isSavingNotes}
                    className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl font-heading font-semibold text-xs hover:bg-brand-700 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{isSavingNotes ? "Saving..." : "Save Notes"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-heading font-semibold text-xs transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LeadsManagementPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-16 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
          <p className="mt-3 text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">
            Loading leads portal...
          </p>
        </div>
      }
    >
      <LeadsManagementContent />
    </React.Suspense>
  );
}
