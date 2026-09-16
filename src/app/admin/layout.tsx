import React from "react";
import type { Metadata } from "next";
import { AdminAuthProvider } from "./AdminAuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Admin Portal | PM Properties",
  description: "Executive analytics dashboard and leads management portal.",
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
      <div className="min-h-screen bg-slate-50 text-slate-900 font-body">
        <AdminSidebar />
        <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen flex flex-col">
          <div className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </AdminAuthProvider>
  );
}
