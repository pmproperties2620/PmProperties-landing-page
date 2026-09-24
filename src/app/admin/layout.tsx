import React from "react";
import type { Metadata } from "next";
import { AdminAuthProvider } from "./AdminAuthContext";
import { PushNotificationProvider } from "@/context/PushNotificationContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import PwaRegister from "@/components/pwa/PwaRegister";

export const metadata: Metadata = {
  title: "PM Admin Portal | The PM Properties",
  description: "Executive analytics dashboard, leads management pipeline, and real estate CMS.",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PM Admin",
  },
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <PushNotificationProvider>
        <PwaRegister />
        <div className="min-h-screen bg-slate-50 text-slate-900 font-body overflow-x-hidden">
          <AdminSidebar />
          <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen flex flex-col min-w-0 overflow-x-hidden">
            <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-w-0">
              {children}
            </div>
          </main>
        </div>
      </PushNotificationProvider>
    </AdminAuthProvider>
  );
}

