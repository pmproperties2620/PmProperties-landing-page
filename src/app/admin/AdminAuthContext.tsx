"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  ArrowRight,
  ArrowLeft,
  ShieldAlert,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";

interface AdminAuthContextType {
  passcode: string;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
  authError: string;
  setPasscode: (code: string) => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [authError, setAuthError] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);

  // Validate passcode against server
  const verifyPasscode = useCallback(async (codeToTest: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/leads?limit=1", {
        headers: {
          "x-admin-passcode": codeToTest,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPasscode(codeToTest);
        setIsAuthenticated(true);
        setAuthError("");
        sessionStorage.setItem("pm_admin_passcode", codeToTest);
        return true;
      } else {
        setAuthError(data.error || "Incorrect passcode. Access denied.");
        setIsAuthenticated(false);
        sessionStorage.removeItem("pm_admin_passcode");
        return false;
      }
    } catch (err) {
      console.error("Passcode verification error:", err);
      setAuthError("Failed to connect to verification server.");
      return false;
    }
  }, []);

  // Restore stored session passcode on mount
  useEffect(() => {
    let active = true;

    async function restoreSession() {
      try {
        const stored = typeof window !== "undefined" ? sessionStorage.getItem("pm_admin_passcode") : null;
        if (stored) {
          const res = await fetch("/api/admin/leads?limit=1", {
            headers: { "x-admin-passcode": stored },
          });
          const data = await res.json();
          if (active) {
            if (res.ok && data.success) {
              setPasscode(stored);
              setIsAuthenticated(true);
            } else {
              sessionStorage.removeItem("pm_admin_passcode");
            }
          }
        }
      } catch {
        if (active) {
          sessionStorage.removeItem("pm_admin_passcode");
        }
      } finally {
        if (active) {
          setIsCheckingAuth(false);
        }
      }
    }

    restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = async (code: string) => {
    setIsSubmitting(true);
    const success = await verifyPasscode(code.trim());
    setIsSubmitting(false);
    return success;
  };

  const logout = () => {
    sessionStorage.removeItem("pm_admin_passcode");
    setPasscode("");
    setIsAuthenticated(false);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setAuthError("Please enter your admin passcode.");
      return;
    }
    await login(inputCode);
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070b14]">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-heading font-semibold uppercase tracking-[0.12em] text-slate-400">
          Verifying Admin Session...
        </p>
      </div>
    );
  }

  // If not authenticated, display the ultra-premium simple executive login gate
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#070b14] overflow-hidden px-4 py-12 selection:bg-brand-600 selection:text-white">
        {/* Ambient Luxury Real Estate Background & Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-[url('/images/hero-bg-new.png')] bg-cover bg-center opacity-15 filter blur-xs scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-[#070b14]/85 to-[#070b14]/70" />
          <div className="absolute -top-36 -left-36 w-96 h-96 bg-[#8E1200]/30 rounded-full blur-[130px]" />
          <div className="absolute -bottom-36 -right-36 w-96 h-96 bg-[#491612]/35 rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-950/25 rounded-full blur-[160px]" />
        </div>

        {/* Main Glass Card Container */}
        <div className="relative z-10 w-full max-w-md">
          {/* Subtle Ambient Glow Border */}
          <div className="absolute -inset-0.5 bg-gradient-to-b from-brand-500/25 to-transparent rounded-[28px] blur-sm opacity-60" />

          <div className="relative bg-[#0d1424]/90 backdrop-blur-2xl rounded-[26px] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-8 sm:p-10 ring-1 ring-white/5">
            {/* Logo & Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <Link href="/" className="group mb-5 block relative">
                <div className="w-20 h-20 rounded-2xl bg-white/95 p-2 shadow-xl ring-1 ring-white/20 flex items-center justify-center group-hover:scale-105 group-hover:shadow-2xl group-hover:shadow-brand-500/20 transition-all duration-300">
                  <Image
                    src="/images/logo.png"
                    alt="PM Properties"
                    width={64}
                    height={64}
                    className="object-contain"
                    priority
                  />
                </div>
              </Link>

              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-heading font-semibold uppercase tracking-[0.16em] mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <Lock className="w-3 h-3 text-brand-400" />
                <span>Secure Admin Console</span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-white tracking-[-0.02em]">
                PM Properties Admin
              </h1>
              <p className="font-body text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xs leading-relaxed">
                Enter your authorized passcode to access analytics & leads.
              </p>
            </div>

            {authError && (
              <div className="mb-5 flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-200 text-xs font-body backdrop-blur-md">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{authError}</span>
              </div>
            )}

            {/* Standard Login Form */}
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="admin-passcode"
                  className="block font-heading text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2"
                >
                  Admin Passcode
                </label>
                <div className="relative">
                  <input
                    id="admin-passcode"
                    type={showPasscode ? "text" : "password"}
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    placeholder="Enter passcode"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-11 text-white placeholder:text-slate-500 font-body text-sm focus:border-brand-500 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                    tabIndex={-1}
                    title={showPasscode ? "Hide passcode" : "Show passcode"}
                  >
                    {showPasscode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#8E1200] via-[#6e150b] to-[#491612] hover:from-[#a01502] hover:to-[#5e1209] text-white rounded-xl py-3.5 px-4 font-heading font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/40 transition-all shadow-lg shadow-brand-950/50 hover:shadow-brand-800/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Back to Home Link */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xs font-body font-medium text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-400" />
                <span>Back to main website</span>
              </Link>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
                <span>256-Bit Encrypted Session • Supabase Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminAuthContext.Provider
      value={{
        passcode,
        isAuthenticated,
        isCheckingAuth,
        login,
        logout,
        authError,
        setPasscode,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return context;
}
