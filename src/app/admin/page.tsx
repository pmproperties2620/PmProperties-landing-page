"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Phone,
  MessageSquare,
  Lock,
  ArrowRight,
  Filter,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  AlertTriangle,
  LogOut,
  FileSpreadsheet,
} from "lucide-react";
import { Lead, LeadStatus } from "@/lib/supabaseServer";
import { REQUIREMENTS, PRICE_RANGES, PROPERTY_STAGES } from "@/data/consultation";

const STATUS_CONFIG: Record<
  LeadStatus,
  { label: string; bg: string; text: string; border: string }
> = {
  new: {
    label: "New",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  contacted: {
    label: "Contacted",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  qualified: {
    label: "Qualified",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  converted: {
    label: "Converted",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  closed: {
    label: "Closed",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/30",
  },
};

export default function AdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [devMessage, setDevMessage] = useState("");

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Active Note Modal State
  const [editingNoteLead, setEditingNoteLead] = useState<Lead | null>(null);
  const [tempNote, setTempNote] = useState("");

  const fetchLeads = useCallback(async (activePasscode: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/leads", {
        headers: {
          "x-admin-passcode": activePasscode,
        },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPasscode(activePasscode);
        setIsAuthenticated(true);
        setLeads(data.leads || []);
        setIsDevMode(Boolean(data.devMode));
        if (data.message) setDevMessage(data.message);
      } else {
        setIsAuthenticated(false);
        sessionStorage.removeItem("pm_admin_passcode");
      }
    } catch (err) {
      console.error("Fetch leads failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Restore stored session passcode on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("pm_admin_passcode");
    if (stored) {
      const timer = setTimeout(() => {
        fetchLeads(stored);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [fetchLeads]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError("Please enter your admin passcode.");
      return;
    }

    setIsVerifying(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/leads", {
        headers: {
          "x-admin-passcode": passcode.trim(),
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setAuthError(data.error || "Incorrect passcode. Access denied.");
        setIsAuthenticated(false);
      } else {
        sessionStorage.setItem("pm_admin_passcode", passcode.trim());
        setIsAuthenticated(true);
        setLeads(data.leads || []);
        setIsDevMode(Boolean(data.devMode));
        if (data.message) setDevMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setAuthError("Failed to connect to server.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingLeadId(leadId);
    try {
      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": activePasscode,
        },
        body: JSON.stringify({
          id: leadId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === leadId ? { ...lead, status: newStatus, updated_at: new Date().toISOString() } : lead
          )
        );
      }
    } catch (err) {
      console.error("Update status failed:", err);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleSaveNote = async () => {
    if (!editingNoteLead) return;
    const leadId = editingNoteLead.id;
    setUpdatingLeadId(leadId);
    try {
      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": activePasscode,
        },
        body: JSON.stringify({
          id: leadId,
          notes: tempNote,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLeads((prev) =>
          prev.map((lead) => (lead.id === leadId ? { ...lead, notes: tempNote } : lead))
        );
        setEditingNoteLead(null);
      }
    } catch (err) {
      console.error("Save note failed:", err);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("pm_admin_passcode");
    setIsAuthenticated(false);
    setPasscode("");
    setLeads([]);
  };

  // Filter & Search Logic
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchTerm === "" ||
        lead.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm);

      const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;
      const matchesSource = selectedSource === "all" || lead.source === selectedSource;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [leads, searchTerm, selectedStatus, selectedSource]);

  // KPI Metrics Calculations
  const metrics = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "new").length;
    const contactedCount = leads.filter((l) => l.status === "contacted").length;
    const qualifiedCount = leads.filter((l) => l.status === "qualified").length;
    const convertedCount = leads.filter((l) => l.status === "converted").length;
    const conversionRate = total > 0 ? Math.round((convertedCount / total) * 100) : 0;

    return { total, newCount, contactedCount, qualifiedCount, convertedCount, conversionRate };
  }, [leads]);

  // CSV Export Utility
  const handleExportCSV = () => {
    if (filteredLeads.length === 0) return;

    const headers = [
      "ID",
      "Full Name",
      "Phone",
      "Requirement",
      "Budget",
      "Stage",
      "Source",
      "Status",
      "Notes",
      "Submitted At",
    ];

    const rows = filteredLeads.map((l) => {
      const reqLabel = REQUIREMENTS.find((r) => r.id === l.requirement)?.label || l.requirement;
      const priceLabel = PRICE_RANGES.find((p) => p.id === l.price_range)?.label || l.price_range;
      const stageLabel = PROPERTY_STAGES.find((s) => s.id === l.property_stage)?.label || l.property_stage;

      return [
        l.id,
        `"${l.full_name.replace(/"/g, '""')}"`,
        `"+91${l.phone}"`,
        `"${reqLabel}"`,
        `"${priceLabel}"`,
        `"${stageLabel}"`,
        l.source,
        l.status,
        `"${(l.notes || "").replace(/"/g, '""')}"`,
        new Date(l.created_at).toLocaleString("en-IN"),
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `pm_properties_leads_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 1. Passcode Authentication Gate
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#111114] border border-white/[0.1] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-600 to-black border border-white/20 flex items-center justify-center text-white shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">PM Properties</h1>
              <p className="text-xs text-zinc-400">Executive Leads Management</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Admin Dashboard</h2>
            <p className="text-sm text-zinc-400">
              Enter your administrative passcode to securely access real-time consultation and contact leads.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Passcode <span className="text-rose-400">*</span>
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  autoFocus
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="Enter admin passcode"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] text-white placeholder:text-zinc-600 text-sm border border-white/[0.1] focus:border-white/40 focus:outline-none transition-all"
                />
              </div>
              {authError && (
                <p className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full group bg-white text-zinc-950 hover:bg-zinc-100 font-semibold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-sm disabled:opacity-70 cursor-pointer"
            >
              {isVerifying ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Unlock Admin Panel</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
            <span className="text-[11px] text-zinc-500">
              Default local passcode: <code className="text-zinc-400 font-mono">pmadmin2026</code> (Configurable in .env.local)
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // 2. Authenticated Admin Dashboard
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0d] text-zinc-100 antialiased">
      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#111115]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-black border border-white/20 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-white tracking-tight">PM Properties</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Admin
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Leads &amp; Inquiries Command Center</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchLeads(passcode || sessionStorage.getItem("pm_admin_passcode") || "")}
              disabled={isLoading}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
              title="Refresh leads"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={filteredLeads.length === 0}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              title="Export to CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-xs font-medium text-rose-300 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Dev Mode Notification if Supabase credentials are not yet added */}
        {isDevMode && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="font-semibold text-amber-300">Supabase Preview Mode: </span>
                <span>{devMessage}</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-mono shrink-0">
              Configure .env.local
            </span>
          </div>
        )}

        {/* ── KPI Metric Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {/* Total Leads */}
          <div className="bg-[#111115] border border-white/[0.08] rounded-2xl p-4 sm:p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-400 font-semibold mb-1">
              Total Inquiries
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{metrics.total}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Across all sources</div>
          </div>

          {/* New Leads */}
          <div className="bg-[#111115] border border-white/[0.08] rounded-2xl p-4 sm:p-5">
            <div className="text-xs uppercase tracking-wider text-blue-400 font-semibold mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              New Leads
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-300">{metrics.newCount}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Awaiting advisor callback</div>
          </div>

          {/* Contacted Leads */}
          <div className="bg-[#111115] border border-white/[0.08] rounded-2xl p-4 sm:p-5">
            <div className="text-xs uppercase tracking-wider text-amber-400 font-semibold mb-1 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              In Progress
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-300">{metrics.contactedCount}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Called or texted</div>
          </div>

          {/* Qualified Leads */}
          <div className="bg-[#111115] border border-white/[0.08] rounded-2xl p-4 sm:p-5">
            <div className="text-xs uppercase tracking-wider text-purple-400 font-semibold mb-1 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              Site Visits
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-300">{metrics.qualifiedCount}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Qualified buyers</div>
          </div>

          {/* Converted Leads */}
          <div className="col-span-2 sm:col-span-1 bg-[#111115] border border-white/[0.08] rounded-2xl p-4 sm:p-5">
            <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Deals Closed
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-300">{metrics.convertedCount}</div>
            <div className="text-[11px] text-zinc-500 mt-1">{metrics.conversionRate}% conversion rate</div>
          </div>
        </div>

        {/* ── Filters & Search Toolbar ── */}
        <div className="bg-[#111115] border border-white/[0.08] rounded-2xl p-4 space-y-3">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search lead by client name or 10-digit mobile number..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] text-white placeholder:text-zinc-500 text-xs sm:text-sm border border-white/[0.08] focus:border-white/30 focus:outline-none transition-all"
              />
            </div>

            {/* Source Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-400 font-medium">Source:</span>
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-white/[0.04] text-white border border-white/[0.08] text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="all" className="bg-[#111115] text-white">All Sources</option>
                <option value="modal" className="bg-[#111115] text-white">Consultation Modal</option>
                <option value="contact_page" className="bg-[#111115] text-white">Contact Page</option>
              </select>
            </div>
          </div>

          {/* Status Tab Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
            <span className="text-zinc-500 font-medium mr-1 shrink-0">Status:</span>
            {[
              { id: "all", label: "All", count: leads.length },
              { id: "new", label: "New", count: metrics.newCount },
              { id: "contacted", label: "Contacted", count: metrics.contactedCount },
              { id: "qualified", label: "Qualified", count: metrics.qualifiedCount },
              { id: "converted", label: "Converted", count: metrics.convertedCount },
              { id: "closed", label: "Closed", count: leads.filter((l) => l.status === "closed").length },
            ].map((tab) => {
              const active = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    active
                      ? "bg-white text-zinc-950 font-semibold shadow-sm"
                      : "bg-white/[0.03] text-zinc-400 hover:text-white hover:bg-white/[0.07] border border-white/[0.06]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      active ? "bg-zinc-200 text-zinc-950 font-bold" : "bg-white/[0.06] text-zinc-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Interactive Leads Table ── */}
        <div className="bg-[#111115] border border-white/[0.08] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-zinc-400 text-[11px] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4 sm:px-6">Client Info</th>
                  <th className="py-3.5 px-4">Direct Connect</th>
                  <th className="py-3.5 px-4">Requirements</th>
                  <th className="py-3.5 px-4">Budget</th>
                  <th className="py-3.5 px-4">Stage</th>
                  <th className="py-3.5 px-4">Source</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-zinc-500">
                      <div className="max-w-xs mx-auto space-y-2">
                        <Filter className="w-8 h-8 text-zinc-600 mx-auto" />
                        <p className="text-sm font-medium text-zinc-400">No leads found</p>
                        <p className="text-xs text-zinc-500">
                          Try adjusting your search query or status filter to see lead records.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const statusStyle = STATUS_CONFIG[lead.status] || STATUS_CONFIG.new;
                    const reqLabel =
                      REQUIREMENTS.find((r) => r.id === lead.requirement)?.label || lead.requirement;
                    const priceLabel =
                      PRICE_RANGES.find((p) => p.id === lead.price_range)?.label || lead.price_range;
                    const stageObj = PROPERTY_STAGES.find((s) => s.id === lead.property_stage);

                    const whatsappMessage = `Hi ${lead.full_name}, this is PM Properties Senior Advisory team regarding your consultation inquiry for ${reqLabel} properties in Mumbai MMR. When would be a good time for a quick 5-minute discussion?`;

                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        {/* Client Info */}
                        <td className="py-4 px-4 sm:px-6">
                          <div className="font-semibold text-white text-sm">
                            {lead.full_name}
                          </div>
                          <div className="text-[11px] text-zinc-400 mt-0.5">
                            {formatDateTime(lead.created_at)}
                          </div>
                          {lead.notes && (
                            <div className="mt-1 text-[11px] text-zinc-300 bg-white/[0.04] p-1.5 rounded-lg border border-white/[0.05] line-clamp-1 max-w-[200px]">
                              Note: {lead.notes}
                            </div>
                          )}
                        </td>

                        {/* Direct Contact Buttons */}
                        <td className="py-4 px-4">
                          <div className="font-mono text-zinc-200 text-xs mb-1.5 font-medium">
                            +91 {lead.phone}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={`tel:+91${lead.phone}`}
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-[11px] text-zinc-300 hover:text-white transition-all"
                              title="Call Client"
                            >
                              <Phone className="w-3 h-3 text-blue-400" />
                              <span>Call</span>
                            </a>
                            <a
                              href={`https://wa.me/91${lead.phone}?text=${encodeURIComponent(
                                whatsappMessage
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[11px] text-[#25D366] transition-all"
                              title="Message on WhatsApp"
                            >
                              <MessageSquare className="w-3 h-3 fill-[#25D366] text-[#25D366]" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </td>

                        {/* Requirements */}
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs font-medium text-zinc-200">
                            {reqLabel}
                          </span>
                        </td>

                        {/* Budget */}
                        <td className="py-4 px-4">
                          <span className="text-xs text-zinc-300 font-medium">
                            {priceLabel}
                          </span>
                        </td>

                        {/* Stage */}
                        <td className="py-4 px-4">
                          <div className="text-xs text-zinc-200 font-medium">
                            {stageObj?.label || lead.property_stage}
                          </div>
                          {stageObj?.tag && (
                            <div className="text-[10px] text-zinc-400">{stageObj.tag}</div>
                          )}
                        </td>

                        {/* Source */}
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] text-zinc-400">
                            {lead.source === "contact_page" ? "Contact Page" : "Modal Form"}
                          </span>
                        </td>

                        {/* Live Status Selector */}
                        <td className="py-4 px-4">
                          <select
                            value={lead.status}
                            disabled={updatingLeadId === lead.id}
                            onChange={(e) =>
                              handleStatusChange(lead.id, e.target.value as LeadStatus)
                            }
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border focus:outline-none transition-all cursor-pointer ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
                          >
                            <option value="new" className="bg-[#111115] text-blue-400">New</option>
                            <option value="contacted" className="bg-[#111115] text-amber-400">Contacted</option>
                            <option value="qualified" className="bg-[#111115] text-purple-400">Qualified</option>
                            <option value="converted" className="bg-[#111115] text-emerald-400">Converted</option>
                            <option value="closed" className="bg-[#111115] text-zinc-400">Closed</option>
                          </select>
                        </td>

                        {/* Actions (Add / Edit Note) */}
                        <td className="py-4 px-4 sm:px-6 text-right">
                          <button
                            onClick={() => {
                              setEditingNoteLead(lead);
                              setTempNote(lead.notes || "");
                            }}
                            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-zinc-300 hover:text-white transition-all cursor-pointer"
                          >
                            {lead.notes ? "Edit Note" : "+ Note"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Count */}
          <div className="p-4 border-t border-white/[0.06] bg-white/[0.01] flex items-center justify-between text-xs text-zinc-400">
            <span>Showing {filteredLeads.length} of {leads.length} recorded leads</span>
            <span className="text-[11px] text-zinc-500">Live Supabase Synchronization</span>
          </div>
        </div>
      </main>

      {/* ── Modal for Editing Follow-up Note ── */}
      {editingNoteLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#111114] border border-white/[0.1] rounded-2xl p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Lead Follow-up Note: {editingNoteLead.full_name}
            </h3>
            <p className="text-xs text-zinc-400">
              Add internal notes, client preferences, budget flexibility, or scheduled site visit times.
            </p>
            <textarea
              rows={4}
              value={tempNote}
              onChange={(e) => setTempNote(e.target.value)}
              placeholder="e.g. Spoke on phone. Looking for riverfront 2 BHK in Kalyan. Site visit booked for Saturday 11 AM."
              className="w-full p-3 rounded-xl bg-white/[0.04] text-white text-xs border border-white/[0.1] focus:border-white/30 focus:outline-none resize-none"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingNoteLead(null)}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-medium text-zinc-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                disabled={updatingLeadId === editingNoteLead.id}
                className="px-4 py-2 rounded-xl bg-white text-zinc-950 hover:bg-zinc-100 text-xs font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
