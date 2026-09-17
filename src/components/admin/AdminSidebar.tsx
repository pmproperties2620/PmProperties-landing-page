"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  MessageSquareQuote,
  Handshake,
  FileText,
  Layers,
} from "lucide-react";
import { useAdminAuth } from "@/app/admin/AdminAuthContext";
import { usePushNotifications } from "@/context/PushNotificationContext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MAIN_NAV_ITEMS: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Leads",
    href: "/admin/leads",
    icon: Users,
  },
  {
    label: "Projects",
    href: "/admin/projects",
    icon: Building2,
  },
];

const CONTENT_NAV_ITEMS: NavItem[] = [
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquareQuote,
  },
  {
    label: "Partner Logos",
    href: "/admin/partners",
    icon: Handshake,
  },
  {
    label: "About Page",
    href: "/admin/about",
    icon: FileText,
  },
  {
    label: "Page Banners",
    href: "/admin/banners",
    icon: Layers,
  },
];

const SYSTEM_NAV_ITEMS: NavItem[] = [
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

interface NavContentProps {
  pathname: string;
  unreadCount: number;
  onLogout: () => void;
  onItemClick?: () => void;
}

function NavContent({ pathname, unreadCount, onLogout, onItemClick }: NavContentProps) {
  const isRouteActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex flex-col h-full justify-between bg-white select-none">
      {/* ─── TOP ZONE: Admin Profile ─── */}
      <div>
        <div className="p-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="relative h-11 w-32 shrink-0 transition-opacity hover:opacity-90 block"
            >
              <Image
                src="/images/logo.png"
                alt="PM Properties"
                fill
                sizes="128px"
                className="object-contain object-left"
                priority
              />
            </Link>
          </div>
          <div className="mt-3.5 flex items-center justify-between">
            <div>
              <h2 className="font-heading font-bold text-sm tracking-tight text-slate-900 leading-tight">
                PM Properties
              </h2>
              <p className="font-body text-xs text-slate-400 font-medium tracking-wide">
                Admin Console
              </p>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-heading font-semibold bg-brand-50 text-brand-600 uppercase tracking-wider">
              Live
            </span>
          </div>
        </div>

        {/* Divider below top zone */}
        <div className="border-b border-slate-200/80 mx-4" />

        {/* ─── MIDDLE ZONE: Navigation ─── */}
        <nav className="p-4 space-y-1 mt-2">
          <p className="px-3.5 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400">
            Overview
          </p>
          {MAIN_NAV_ITEMS.map((item) => {
            const active = isRouteActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-heading text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-brand-50 text-brand-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-brand-600 rounded-r-md" />
                )}
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    active ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="flex-1 text-left">{item.label}</span>
                {item.href === "/admin/leads" && unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-heading font-bold text-white bg-rose-600 rounded-full shadow-xs">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-3 pb-1">
            <p className="px-3.5 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400">
              Content CMS
            </p>
          </div>
          {CONTENT_NAV_ITEMS.map((item) => {
            const active = isRouteActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-heading text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-brand-50 text-brand-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-brand-600 rounded-r-md" />
                )}
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    active ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 pb-1">
            <p className="px-3.5 py-1 text-[10px] font-heading font-bold uppercase tracking-wider text-slate-400">
              System
            </p>
          </div>
          {SYSTEM_NAV_ITEMS.map((item) => {
            const active = isRouteActive(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onItemClick}
                className={`group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-heading text-sm font-semibold transition-all duration-200 ${
                  active
                    ? "bg-brand-50 text-brand-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-brand-600 rounded-r-md" />
                )}
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-105 ${
                    active ? "text-brand-600" : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="flex-1 text-left">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ─── BOTTOM ZONE: Pinned to bottom ─── */}
      <div className="p-4 border-t border-slate-200/80 mt-auto bg-slate-50/50">
        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-heading text-xs font-semibold text-rose-600/80 hover:text-rose-700 hover:bg-rose-50/80 transition-colors cursor-pointer text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdminAuth();
  const { unreadCount } = usePushNotifications();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-4 flex items-center justify-between z-40">
        <Link href="/" className="relative h-9 w-28 block">
          <Image
            src="/images/logo.png"
            alt="PM Properties"
            fill
            sizes="112px"
            className="object-contain"
            priority
          />
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-heading font-semibold text-slate-500">Admin</span>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full ring-2 ring-white" />
            )}
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-68 max-w-full bg-white h-full shadow-2xl z-10 flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-heading font-bold text-sm text-slate-900">Navigation</span>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <NavContent
                pathname={pathname}
                unreadCount={unreadCount}
                onLogout={logout}
                onItemClick={() => setMobileOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block fixed top-0 bottom-0 left-0 w-64 border-r border-slate-200/80 bg-white z-30">
        <NavContent pathname={pathname} unreadCount={unreadCount} onLogout={logout} />
      </aside>
    </>
  );
}
