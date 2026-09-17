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
  Bell,
  BellRing,
  Smartphone,
  Share,
  Plus,
  Monitor,
  Info,
} from "lucide-react";
import { useAdminAuth } from "../AdminAuthContext";
import { usePushNotifications } from "@/context/PushNotificationContext";
import { Lead } from "@/lib/supabaseServer";

export default function AdminSettingsPage() {
  const { logout, passcode, setPasscode } = useAdminAuth();
  const {
    isSupported,
    isSubscribed,
    permission,
    subscribeToPush,
    sendTestPush,
  } = usePushNotifications();
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Push Notification State
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isTestingPush, setIsTestingPush] = useState(false);
  const [pushStatusMsg, setPushStatusMsg] = useState("");
  const [pushErrorMsg, setPushErrorMsg] = useState("");
  const [pwaGuideTab, setPwaGuideTab] = useState<"ios" | "android" | "desktop">("ios");

  const handleEnablePush = async () => {
    setPushErrorMsg("");
    setPushStatusMsg("");
    setIsSubscribing(true);
    try {
      const success = await subscribeToPush();
      if (success) {
        setPushStatusMsg("Push notifications enabled! You will receive live alerts when new leads arrive.");
      } else {
        if (typeof window !== "undefined" && window.Notification?.permission === "denied") {
          setPushErrorMsg("Notifications are blocked by your browser. Please allow notifications in your browser's site settings.");
        } else {
          setPushErrorMsg("Could not enable notifications. Please confirm permissions.");
        }
      }
    } catch {
      setPushErrorMsg("An unexpected error occurred while subscribing.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleTestPush = async () => {
    setPushErrorMsg("");
    setPushStatusMsg("");
    setIsTestingPush(true);
    try {
      const res = await sendTestPush();
      if (res.success) {
        setPushStatusMsg(res.message);
      } else {
        setPushErrorMsg(res.message);
      }
    } catch {
      setPushErrorMsg("Failed to send test notification.");
    } finally {
      setIsTestingPush(false);
    }
  };

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

      {/* ─── 3. Instant Push Notifications & Alerts ─── */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm ring-1 ring-slate-200/60 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                PWA Push Notifications & Instant Alerts
              </h2>
              <p className="font-body text-xs text-slate-500">
                Get real-time alerts on your phone or computer the second a client requests a consultation.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            {isSubscribed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Active & Subscribed
              </span>
            ) : !isSupported ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-slate-100 text-slate-500">
                Browser Unsupported
              </span>
            ) : permission === "denied" ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                Notifications Blocked
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                Not Subscribed
              </span>
            )}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-body text-slate-600 max-w-md">
              Push alerts display the client&apos;s name, property demand (1/2/3 BHK), and budget bracket with deep-links directly into the lead record.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Supports Android, Windows, Mac, and iOS 16.4+ (when added to Home Screen).</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            {!isSubscribed ? (
              <button
                type="button"
                onClick={handleEnablePush}
                disabled={isSubscribing || !isSupported}
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2.5 rounded-xl font-heading font-semibold text-xs hover:bg-brand-700 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Bell className="w-4 h-4" />
                <span>{isSubscribing ? "Enabling..." : "Enable Push Notifications"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleTestPush}
                disabled={isTestingPush}
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-heading font-semibold text-xs hover:bg-slate-800 transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                <BellRing className="w-4 h-4" />
                <span>{isTestingPush ? "Sending..." : "Send Test Notification"}</span>
              </button>
            )}
          </div>
        </div>

        {pushStatusMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-heading font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{pushStatusMsg}</span>
          </div>
        )}

        {pushErrorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-heading font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{pushErrorMsg}</span>
          </div>
        )}
      </div>

      {/* ─── PWA Mobile Installation Guide (iPhone & Android) ─── */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-sm ring-1 ring-slate-200/60 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-bold text-base text-slate-900">
                PWA Mobile App Setup Guide
              </h2>
              <p className="font-body text-xs text-slate-500">
                Step-by-step instructions to install PM Admin on your home screen and enable lockscreen push alerts.
              </p>
            </div>
          </div>

          {/* Platform Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit border border-slate-200/70 shrink-0">
            <button
              type="button"
              onClick={() => setPwaGuideTab("ios")}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                pwaGuideTab === "ios"
                  ? "bg-white text-brand-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              iPhone (iOS)
            </button>
            <button
              type="button"
              onClick={() => setPwaGuideTab("android")}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                pwaGuideTab === "android"
                  ? "bg-white text-brand-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Android
            </button>
            <button
              type="button"
              onClick={() => setPwaGuideTab("desktop")}
              className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition-all cursor-pointer ${
                pwaGuideTab === "desktop"
                  ? "bg-white text-brand-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Windows / Mac
            </button>
          </div>
        </div>

        {/* ── Tab: iPhone (iOS) ── */}
        {pwaGuideTab === "ios" && (
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/70 text-amber-900 text-xs font-body flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p>
                <strong className="font-heading font-semibold">Important Apple iOS Requirement:</strong> Apple requires using <span className="font-semibold underline">Safari</span> to install PWAs. In addition, Apple iOS only allows Web Push notifications once the app has been added to your Home Screen (requires iOS 16.4 or newer).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs mb-2">
                    1
                  </span>
                  <h4 className="font-heading font-bold text-xs text-slate-900">
                    Open in Safari
                  </h4>
                  <p className="font-body text-[11px] text-slate-600 leading-relaxed mt-1">
                    Open this admin portal in Apple <strong className="text-slate-800">Safari</strong> on your iPhone.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">browser: Safari</div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs mb-2">
                    2
                  </span>
                  <h4 className="font-heading font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>Tap Share</span>
                    <Share className="w-3.5 h-3.5 text-blue-600" />
                  </h4>
                  <p className="font-body text-[11px] text-slate-600 leading-relaxed mt-1">
                    Tap the <strong className="text-slate-800">Share</strong> icon (the square with arrow pointing up) on the bottom toolbar.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">action: Share icon</div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs mb-2">
                    3
                  </span>
                  <h4 className="font-heading font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>Add to Home Screen</span>
                    <Plus className="w-3.5 h-3.5 text-slate-700" />
                  </h4>
                  <p className="font-body text-[11px] text-slate-600 leading-relaxed mt-1">
                    Scroll down and select <strong className="text-slate-800">&quot;Add to Home Screen&quot;</strong>, then tap <strong className="text-slate-800">&quot;Add&quot;</strong> in the top right.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">installs app icon</div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs mb-2">
                    4
                  </span>
                  <h4 className="font-heading font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>Open &amp; Enable Push</span>
                    <Bell className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="font-body text-[11px] text-slate-600 leading-relaxed mt-1">
                    Launch <strong className="text-slate-800">PM Admin</strong> from your iPhone home screen, go to Settings, and tap <strong className="text-slate-800">&quot;Enable Push Notifications&quot;</strong>.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">lockscreen alerts</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Android ── */}
        {pwaGuideTab === "android" && (
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-emerald-900 text-xs font-body flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                <strong className="font-heading font-semibold">Native Android Support:</strong> Android fully supports PWA installation through Google Chrome, Samsung Internet, or Brave with instant lockscreen and status bar push alerts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Step 1 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs mb-2">
                    1
                  </span>
                  <h4 className="font-heading font-bold text-xs text-slate-900">
                    Open in Chrome
                  </h4>
                  <p className="font-body text-[11px] text-slate-600 leading-relaxed mt-1">
                    Open this admin portal URL in <strong className="text-slate-800">Google Chrome</strong> on your Android phone.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">browser: Chrome</div>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs mb-2">
                    2
                  </span>
                  <h4 className="font-heading font-bold text-xs text-slate-900">
                    Tap Menu (⋮)
                  </h4>
                  <p className="font-body text-[11px] text-slate-600 leading-relaxed mt-1">
                    Tap the <strong className="text-slate-800">three vertical dots (⋮)</strong> menu in the top right corner of Chrome.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">action: Browser menu</div>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs mb-2">
                    3
                  </span>
                  <h4 className="font-heading font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>Install App</span>
                    <Download className="w-3.5 h-3.5 text-slate-700" />
                  </h4>
                  <p className="font-body text-[11px] text-slate-600 leading-relaxed mt-1">
                    Select <strong className="text-slate-800">&quot;Install app&quot;</strong> or <strong className="text-slate-800">&quot;Add to Home screen&quot;</strong>, then confirm by tapping <strong className="text-slate-800">Install</strong>.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">adds to app drawer</div>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs mb-2">
                    4
                  </span>
                  <h4 className="font-heading font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <span>Allow Notifications</span>
                    <Bell className="w-3.5 h-3.5 text-emerald-600" />
                  </h4>
                  <p className="font-body text-[11px] text-slate-600 leading-relaxed mt-1">
                    Launch the app from your home screen. In Settings, click <strong className="text-slate-800">&quot;Enable Push Notifications&quot;</strong> and tap <strong className="text-slate-800">Allow</strong>.
                  </p>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">immediate push alerts</div>
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Desktop (PC / Mac) ── */}
        {pwaGuideTab === "desktop" && (
          <div className="space-y-4 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs font-body flex items-start gap-2.5">
              <Monitor className="w-4 h-4 text-slate-700 shrink-0 mt-0.5" />
              <p>
                <strong className="font-heading font-semibold">Standalone Desktop App:</strong> Installing on Google Chrome, Microsoft Edge, or Safari creates a dedicated desktop application with native window controls and OS notifications.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs">
                  1
                </span>
                <h4 className="font-heading font-bold text-xs text-slate-900">
                  Address Bar Icon
                </h4>
                <p className="font-body text-[11px] text-slate-600 leading-relaxed">
                  In Chrome or Edge, look for the <strong className="text-slate-800">Install icon</strong> (computer screen with down arrow) on the far right of the address bar.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs">
                  2
                </span>
                <h4 className="font-heading font-bold text-xs text-slate-900">
                  Click Install
                </h4>
                <p className="font-body text-[11px] text-slate-600 leading-relaxed">
                  Click <strong className="text-slate-800">&quot;Install&quot;</strong>. PM Admin will instantly pop out into its own standalone desktop window.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-brand-50 text-brand-600 font-heading font-bold text-xs">
                  3
                </span>
                <h4 className="font-heading font-bold text-xs text-slate-900">
                  Enable Desktop Alerts
                </h4>
                <p className="font-body text-[11px] text-slate-600 leading-relaxed">
                  Click <strong className="text-slate-800">&quot;Enable Push Notifications&quot;</strong> in Settings to receive Windows or macOS system notifications whenever a lead submits.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── 5. Data Export ─── */}
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
