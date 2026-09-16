"use client";

import React, { useState } from "react";
import {
  Shield,
  Download,
  LogOut,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Lock,
  RotateCcw,
} from "lucide-react";
import { useAdminAuth } from "../AdminAuthContext";
import { Lead } from "@/lib/supabaseServer";

export default function AdminSettingsPage() {
  const { logout, passcode, setPasscode } = useAdminAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Change Passcode Form State
  const [currentCode, setCurrentCode] = useState("");
  const [newCode, setNewCode] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [isUpdatingCode, setIsUpdatingCode] = useState(false);
  const [codeSuccessMsg, setCodeSuccessMsg] = useState("");
  const [codeErrorMsg, setCodeErrorMsg] = useState("");

  const handleUpdatePasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    setCodeErrorMsg("");
    setCodeSuccessMsg("");

    if (!currentCode.trim()) {
      setCodeErrorMsg("Please enter your current admin passcode.");
      return;
    }

    if (!newCode.trim() || newCode.trim().length < 6) {
      setCodeErrorMsg("New passcode must be at least 6 characters long.");
      return;
    }

    if (newCode !== confirmCode) {
      setCodeErrorMsg("New passcode and confirmation do not match.");
      return;
    }

    setIsUpdatingCode(true);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode || sessionStorage.getItem("pm_admin_passcode") || "",
        },
        body: JSON.stringify({
          action: "change",
          currentPasscode: currentCode.trim(),
          newPasscode: newCode.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setCodeSuccessMsg("Admin passcode updated successfully! Stored for this and future sessions.");
        // Update session state
        setPasscode(newCode.trim());
        sessionStorage.setItem("pm_admin_passcode", newCode.trim());
        setCurrentCode("");
        setNewCode("");
        setConfirmCode("");
        setTimeout(() => setCodeSuccessMsg(""), 5000);
      } else {
        setCodeErrorMsg(data.error || "Failed to update passcode.");
      }
    } catch (err) {
      console.error("Passcode update failed:", err);
      setCodeErrorMsg("Failed to connect to authentication server.");
    } finally {
      setIsUpdatingCode(false);
    }
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    setExportSuccess(false);

    try {
      const activePasscode = passcode || sessionStorage.getItem("pm_admin_passcode") || "";
      const res = await fetch("/api/admin/leads?limit=500", {
        headers: {
          "x-admin-passcode": activePasscode,
        },
      });

      const data = await res.json();
      if (res.ok && data.success && data.leads) {
        const leads = data.leads;
        const headers = [
          "ID",
          "Full Name",
          "Phone",
          "Requirement",
          "Price Range",
          "Stage",
          "Source",
          "Status",
          "Notes",
          "Created At",
        ];

        const leadList = (leads || []) as Lead[];
        const rows = leadList.map((l: Lead) => [
          l.id,
          `"${(l.full_name || "").replace(/"/g, '""')}"`,
          `"${l.phone || ""}"`,
          `"${(l.requirement || "").replace(/"/g, '""')}"`,
          `"${l.price_range ? `₹${l.price_range} Lakhs` : ""}"`,
          `"${(l.property_stage || "").replace(/_/g, " ")}"`,
          `"${l.source || ""}"`,
          `"${l.status || ""}"`,
          `"${(l.notes || "").replace(/"/g, '""')}"`,
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

        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Export CSV error:", err);
      alert("Failed to export leads.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* ─── Header ─── */}
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-slate-900 leading-tight">
          Admin Settings & Security
        </h1>
        <p className="font-body text-xs sm:text-sm text-slate-500 mt-1">
          Manage your admin passcode and export consultation lead records.
        </p>
      </div>

      {/* ─── 1. Password Update Form ─── */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm ring-1 ring-slate-200/60 space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900">
              Change Admin Passcode
            </h2>
            <p className="font-body text-xs text-slate-500">
              Update your active authentication passcode for accessing the admin console.
            </p>
          </div>
        </div>

        {codeErrorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-body flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{codeErrorMsg}</span>
          </div>
        )}

        {codeSuccessMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-body flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{codeSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePasscode} className="space-y-4 pt-2 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-heading text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Current Passcode
              </label>
              <input
                type="password"
                value={currentCode}
                onChange={(e) => setCurrentCode(e.target.value)}
                placeholder="Enter current passcode"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 font-body text-xs sm:text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 transition-all"
              />
            </div>

            <div>
              <label className="block font-heading text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                New Passcode
              </label>
              <input
                type="password"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 font-body text-xs sm:text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 transition-all"
              />
            </div>

            <div>
              <label className="block font-heading text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Confirm Passcode
              </label>
              <input
                type="password"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                placeholder="Re-enter new passcode"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 font-body text-xs sm:text-sm focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/20 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isUpdatingCode}
              className="inline-flex items-center gap-2 bg-brand-600 text-white px-5 py-2.5 rounded-xl font-heading font-semibold text-xs hover:bg-brand-700 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isUpdatingCode ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating Passcode...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Update Passcode</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* ─── 3. Data Export ─── */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm ring-1 ring-slate-200/60 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900">
              Data Portability & Export
            </h2>
            <p className="font-body text-xs text-slate-500">
              Download your entire consultation leads registry as a formatted CSV file.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs font-body text-slate-600 max-w-md">
            Exports all client names, contact numbers, property requirements, budget brackets, and follow-up notes for spreadsheet analysis or CRM import.
          </p>

          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-heading font-semibold text-xs hover:bg-slate-800 transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>{isExporting ? "Exporting..." : "Download CSV Report"}</span>
          </button>
        </div>

        {exportSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-heading font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>CSV file downloaded successfully!</span>
          </div>
        )}
      </div>

      {/* ─── 4. Session Management ─── */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm ring-1 ring-slate-200/60 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base text-slate-900">
              Admin Session
            </h2>
            <p className="font-body text-xs text-slate-500">
              Terminate your authenticated browser session.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-body text-slate-600">
            Clicking sign out will clear stored tokens from this browser session.
          </p>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 px-4 py-2 rounded-xl font-heading font-semibold text-xs transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Now</span>
          </button>
        </div>
      </div>
    </div>
  );
}
