"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  FileText,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useAdminAuth } from "../AdminAuthContext";
import { compressImage } from "@/lib/compressImage";

interface ShowcaseRow {
  id: string;
  image_url: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
}

interface MilestoneRow {
  id: string;
  year_label: string;
  title: string;
  description: string;
  image_urls: string[];
  display_order: number;
  is_published: boolean;
  created_at: string;
}

export default function AdminAboutPage() {
  const { passcode } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<"showcase" | "milestones">("showcase");

  // Data states
  const [showcases, setShowcases] = useState<ShowcaseRow[]>([]);
  const [milestones, setMilestones] = useState<MilestoneRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Showcase Modal state
  const [isShowcaseModalOpen, setIsShowcaseModalOpen] = useState(false);
  const [editingShowcaseId, setEditingShowcaseId] = useState<string | null>(null);
  const [showcaseForm, setShowcaseForm] = useState({
    image_url: "",
    display_order: 0,
    is_published: true,
  });
  const [isUploadingShowcase, setIsUploadingShowcase] = useState(false);

  // Milestone Modal state
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [milestoneForm, setMilestoneForm] = useState({
    year_label: "",
    title: "",
    description: "",
    image_urls: [] as string[],
    display_order: 0,
    is_published: true,
  });
  const [newImageUrlInput, setNewImageUrlInput] = useState("");
  const [isUploadingMilestoneImage, setIsUploadingMilestoneImage] = useState(false);

  // Deletion state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "showcase" | "milestone";
    id: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch all data
  const fetchData = useCallback(async () => {
    try {
      const [showcaseRes, milestoneRes] = await Promise.all([
        fetch("/api/admin/about-showcase", { headers: { "x-admin-passcode": passcode } }),
        fetch("/api/admin/timeline-milestones", { headers: { "x-admin-passcode": passcode } }),
      ]);

      const showcaseData = await showcaseRes.json();
      const milestoneData = await milestoneRes.json();

      if (showcaseRes.ok && showcaseData.success) {
        setShowcases(showcaseData.images || []);
      }
      if (milestoneRes.ok && milestoneData.success) {
        setMilestones(milestoneData.milestones || []);
      }

      setIsTableMissing(
        Boolean(showcaseData.tableMissing) || Boolean(milestoneData.tableMissing)
      );
    } catch {
      showToast("error", "Error contacting server.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [passcode, showToast]);

  useEffect(() => {
    if (!passcode) return;
    let ignore = false;

    Promise.all([
      fetch("/api/admin/about-showcase", { headers: { "x-admin-passcode": passcode } }).then((r) =>
        r.json()
      ),
      fetch("/api/admin/timeline-milestones", { headers: { "x-admin-passcode": passcode } }).then((r) =>
        r.json()
      ),
    ])
      .then(([showcaseData, milestoneData]) => {
        if (ignore) return;
        if (showcaseData && showcaseData.success) {
          setShowcases(showcaseData.images || []);
        }
        if (milestoneData && milestoneData.success) {
          setMilestones(milestoneData.milestones || []);
        }
        setIsTableMissing(
          Boolean(showcaseData?.tableMissing) || Boolean(milestoneData?.tableMissing)
        );
      })
      .catch((err) => {
        if (ignore) return;
        console.error("Failed to load about data:", err);
        showToast("error", "Error contacting server.");
      })
      .finally(() => {
        if (!ignore) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [passcode, showToast]);

  // Upload helper
  const handleUploadSingle = async (
    file: File,
    onSuccess: (url: string) => void,
    setLoadingState: (loading: boolean) => void
  ) => {
    try {
      setLoadingState(true);
      const optimized = await compressImage(file);
      const uploadData = new FormData();
      uploadData.append("file", optimized);
      uploadData.append("folder", "about");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-passcode": passcode },
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.publicUrl) {
        onSuccess(data.publicUrl);
        showToast("success", "Image optimized and uploaded.");
      } else {
        showToast("error", data.error || "Failed to upload image.");
      }
    } catch {
      showToast("error", "Network error uploading image.");
    } finally {
      setLoadingState(false);
    }
  };

  // Save Showcase Item
  const handleSaveShowcase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showcaseForm.image_url.trim()) {
      showToast("error", "Image URL is required.");
      return;
    }

    try {
      const payload = {
        ...showcaseForm,
        display_order: Number(showcaseForm.display_order) || 0,
      };

      if (editingShowcaseId) {
        const res = await fetch("/api/admin/about-showcase", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
          body: JSON.stringify({ id: editingShowcaseId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setShowcases((prev) =>
            prev.map((item) => (item.id === editingShowcaseId ? data.item : item))
          );
          setIsShowcaseModalOpen(false);
          showToast("success", "Showcase image updated.");
        } else {
          showToast("error", data.error || "Failed to update.");
        }
      } else {
        const res = await fetch("/api/admin/about-showcase", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setShowcases((prev) => [...prev, data.item]);
          setIsShowcaseModalOpen(false);
          showToast("success", "Showcase image added.");
        } else {
          showToast("error", data.error || "Failed to create.");
        }
      }
    } catch {
      showToast("error", "Error saving showcase image.");
    }
  };

  // Save Milestone Item
  const handleSaveMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneForm.year_label.trim() || !milestoneForm.title.trim()) {
      showToast("error", "Year label and Title are required.");
      return;
    }

    try {
      const payload = {
        ...milestoneForm,
        display_order: Number(milestoneForm.display_order) || 0,
      };

      if (editingMilestoneId) {
        const res = await fetch("/api/admin/timeline-milestones", {
          method: "PUT",
          headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
          body: JSON.stringify({ id: editingMilestoneId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMilestones((prev) =>
            prev.map((item) => (item.id === editingMilestoneId ? data.milestone : item))
          );
          setIsMilestoneModalOpen(false);
          showToast("success", "Milestone updated.");
        } else {
          showToast("error", data.error || "Failed to update.");
        }
      } else {
        const res = await fetch("/api/admin/timeline-milestones", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-passcode": passcode },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setMilestones((prev) => [...prev, data.milestone]);
          setIsMilestoneModalOpen(false);
          showToast("success", "Milestone added.");
        } else {
          showToast("error", data.error || "Failed to create.");
        }
      }
    } catch {
      showToast("error", "Error saving milestone.");
    }
  };

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      const endpoint =
        deleteTarget.type === "showcase"
          ? `/api/admin/about-showcase?id=${deleteTarget.id}`
          : `/api/admin/timeline-milestones?id=${deleteTarget.id}`;

      const res = await fetch(endpoint, {
        method: "DELETE",
        headers: { "x-admin-passcode": passcode },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (deleteTarget.type === "showcase") {
          setShowcases((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        } else {
          setMilestones((prev) => prev.filter((item) => item.id !== deleteTarget.id));
        }
        setDeleteTarget(null);
        showToast("success", "Deleted successfully.");
      } else {
        showToast("error", data.error || "Failed to delete.");
      }
    } catch {
      showToast("error", "Error deleting item.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-heading font-medium transition-all ${
            toast.type === "success"
              ? "bg-emerald-950/95 border-emerald-800 text-emerald-100"
              : "bg-rose-950/95 border-rose-800 text-rose-100"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              About & Homepage Content
            </h1>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              Manage the Homepage Showcase photos and the About page Timeline Milestones in-depth.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsRefreshing(true);
              fetchData();
            }}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-600" : ""}`} />
          </button>

          <button
            type="button"
            onClick={() => {
              if (activeTab === "showcase") {
                setEditingShowcaseId(null);
                setShowcaseForm({
                  image_url: "",
                  display_order: showcases.length + 1,
                  is_published: true,
                });
                setIsShowcaseModalOpen(true);
              } else {
                setEditingMilestoneId(null);
                setMilestoneForm({
                  year_label: "",
                  title: "",
                  description: "",
                  image_urls: [],
                  display_order: milestones.length + 1,
                  is_published: true,
                });
                setIsMilestoneModalOpen(true);
              }
            }}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-heading font-semibold text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === "showcase" ? "Add Homepage Photo" : "Add Timeline Milestone"}</span>
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit border border-slate-200/70">
        <button
          type="button"
          onClick={() => setActiveTab("showcase")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "showcase"
              ? "bg-white text-brand-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Homepage Showcase ({showcases.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("milestones")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-heading text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeTab === "milestones"
              ? "bg-white text-brand-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Timeline Milestones ({milestones.length})</span>
        </button>
      </div>

      {/* Database Schema Notice */}
      {isTableMissing && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-heading font-bold text-sm text-amber-900">
                Database Schema Ready in Supabase
              </h4>
              <p className="font-body text-xs text-amber-800 mt-0.5">
                Run the script in <code className="px-1.5 py-0.5 bg-amber-200/60 rounded text-amber-950 font-mono font-semibold">supabase/schema.sql</code> to enable cloud database persistence for about content.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsRefreshing(true);
              fetchData();
            }}
            className="shrink-0 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-heading font-semibold rounded-xl"
          >
            Check Status
          </button>
        </div>
      )}

      {/* Tab 1: Bento Showcase */}
      {activeTab === "showcase" && (
        <div>
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
              <p className="font-heading text-sm text-slate-500">Loading showcase photos...</p>
            </div>
          ) : showcases.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <Sparkles className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-base text-slate-800">No Showcase Photos Yet</h3>
              <p className="font-body text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Add 3–6 property photos to auto-cycle smoothly inside the Homepage Showcase section.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditingShowcaseId(null);
                  setShowcaseForm({
                    image_url: "",
                    display_order: 1,
                    is_published: true,
                  });
                  setIsShowcaseModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-heading font-semibold hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Photo</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {showcases.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden group">
                    <Image
                      src={item.image_url}
                      alt="Showcase Preview"
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${
                        item.is_published ? "bg-emerald-500/90 text-white" : "bg-slate-700/90 text-white"
                      }`}
                    >
                      {item.is_published ? "Active" : "Hidden"}
                    </span>
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-black/60 text-white">
                      Order #{item.display_order}
                    </span>
                  </div>

                  <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
                      {item.image_url}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingShowcaseId(item.id);
                          setShowcaseForm({
                            image_url: item.image_url,
                            display_order: item.display_order,
                            is_published: item.is_published,
                          });
                          setIsShowcaseModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget({ type: "showcase", id: item.id })}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Journey Milestones */}
      {activeTab === "milestones" && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
              <p className="font-heading text-sm text-slate-500">Loading timeline milestones...</p>
            </div>
          ) : milestones.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-heading font-bold text-base text-slate-800">No Milestones Yet</h3>
              <p className="font-body text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Add milestones to the About page timeline with photos, narrative stories, and years.
              </p>
              <button
                type="button"
                onClick={() => {
                  setEditingMilestoneId(null);
                  setMilestoneForm({
                    year_label: "",
                    title: "",
                    description: "",
                    image_urls: [],
                    display_order: 1,
                    is_published: true,
                  });
                  setIsMilestoneModalOpen(true);
                }}
                className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-heading font-semibold hover:bg-brand-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add First Milestone</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {milestones.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-sm transition-shadow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-heading font-bold bg-[#0a1128]/10 text-[#0a1128]">
                        {m.year_label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${
                          m.is_published ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {m.is_published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Order #{m.display_order}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-base text-slate-900">{m.title}</h3>
                    <p className="font-body text-xs text-slate-600 line-clamp-2 max-w-2xl leading-relaxed">
                      {m.description}
                    </p>
                  </div>

                  {/* Thumbnail Strip */}
                  <div className="flex items-center gap-2 overflow-x-auto max-w-xs shrink-0 py-1">
                    {m.image_urls && m.image_urls.length > 0 ? (
                      m.image_urls.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-14 h-12 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0"
                        >
                          <Image
                            src={img}
                            alt="Milestone"
                            fill
                            sizes="56px"
                            className="object-contain p-1"
                          />
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">No photos</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 w-full lg:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMilestoneId(m.id);
                        setMilestoneForm({
                          year_label: m.year_label,
                          title: m.title,
                          description: m.description,
                          image_urls: m.image_urls || [],
                          display_order: m.display_order,
                          is_published: m.is_published,
                        });
                        setIsMilestoneModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-heading font-semibold text-slate-700 transition-colors flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ type: "milestone", id: m.id })}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Showcase Modal */}
      {isShowcaseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                {editingShowcaseId ? "Edit Showcase Photo" : "Add Showcase Photo"}
              </h3>
              <button
                type="button"
                onClick={() => setIsShowcaseModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveShowcase} className="space-y-4">
              <div>
                <label className="block text-xs font-heading font-semibold text-slate-700 mb-1.5">
                  Showcase Photo *
                </label>
                <div className="flex gap-3 items-start">
                  <div className="relative w-24 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                    {showcaseForm.image_url ? (
                      <Image
                        src={showcaseForm.image_url}
                        alt="Preview"
                        fill
                        sizes="96px"
                        className="object-contain p-1.5"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px]">
                        <Upload className="w-4 h-4 mb-1" />
                        <span>No Photo</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={showcaseForm.image_url}
                      onChange={(e) =>
                        setShowcaseForm({ ...showcaseForm, image_url: e.target.value })
                      }
                      placeholder="Paste image URL or upload..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                    />

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-semibold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingShowcase ? "Optimizing..." : "Upload & Optimize"}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        disabled={isUploadingShowcase}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleUploadSingle(
                              file,
                              (url) => setShowcaseForm((prev) => ({ ...prev, image_url: url })),
                              setIsUploadingShowcase
                            );
                          }
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={showcaseForm.display_order}
                    onChange={(e) =>
                      setShowcaseForm({
                        ...showcaseForm,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={showcaseForm.is_published}
                      onChange={(e) =>
                        setShowcaseForm({ ...showcaseForm, is_published: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs font-heading font-semibold text-slate-700">
                      Show on Homepage
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsShowcaseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-heading font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingShowcase}
                  className="px-5 py-2 rounded-xl text-xs font-heading font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Milestone Modal (with Multi-Image Gallery Strip Pattern) */}
      {isMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                {editingMilestoneId ? "Edit Timeline Milestone" : "Add Timeline Milestone"}
              </h3>
              <button
                type="button"
                onClick={() => setIsMilestoneModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMilestone} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                    Year / Timeframe Label *
                  </label>
                  <input
                    type="text"
                    value={milestoneForm.year_label}
                    onChange={(e) =>
                      setMilestoneForm({ ...milestoneForm, year_label: e.target.value })
                    }
                    placeholder="e.g. 2021 - 2024 or September 1, 2020"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={milestoneForm.display_order}
                    onChange={(e) =>
                      setMilestoneForm({
                        ...milestoneForm,
                        display_order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                  Milestone Headline *
                </label>
                <input
                  type="text"
                  value={milestoneForm.title}
                  onChange={(e) =>
                    setMilestoneForm({ ...milestoneForm, title: e.target.value })
                  }
                  placeholder="e.g. Growth & Partnerships"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                  Story Narrative Description
                </label>
                <textarea
                  rows={3}
                  value={milestoneForm.description}
                  onChange={(e) =>
                    setMilestoneForm({ ...milestoneForm, description: e.target.value })
                  }
                  placeholder="Share the story and achievements behind this milestone..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Multi-Image Gallery Strip Pattern */}
              <div>
                <label className="block text-xs font-heading font-semibold text-slate-700 mb-2">
                  Milestone Imagery (1-5 Photos for Slider)
                </label>

                {/* Thumbnails */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {milestoneForm.image_urls.map((url, idx) => (
                    <div
                      key={idx}
                      className="group relative w-16 h-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                    >
                      <Image
                        src={url}
                        alt={`Photo ${idx + 1}`}
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMilestoneForm((prev) => ({
                            ...prev,
                            image_urls: prev.image_urls.filter((u) => u !== url),
                          }))
                        }
                        className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Photo Controls */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newImageUrlInput}
                    onChange={(e) => setNewImageUrlInput(e.target.value)}
                    placeholder="Paste photo URL..."
                    className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newImageUrlInput.trim() && !milestoneForm.image_urls.includes(newImageUrlInput.trim())) {
                        setMilestoneForm((prev) => ({
                          ...prev,
                          image_urls: [...prev.image_urls, newImageUrlInput.trim()],
                        }));
                        setNewImageUrlInput("");
                      }
                    }}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-semibold rounded-xl"
                  >
                    Add URL
                  </button>

                  <label className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-heading font-semibold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingMilestoneImage ? "Optimizing..." : "Upload Device"}</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={isUploadingMilestoneImage}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleUploadSingle(
                            file,
                            (url) =>
                              setMilestoneForm((prev) => ({
                                ...prev,
                                image_urls: [...prev.image_urls, url],
                              })),
                            setIsUploadingMilestoneImage
                          );
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={milestoneForm.is_published}
                    onChange={(e) =>
                      setMilestoneForm({ ...milestoneForm, is_published: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs font-heading font-semibold text-slate-700">
                    Publish Milestone to About Timeline
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsMilestoneModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-heading font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploadingMilestoneImage}
                  className="px-5 py-2 rounded-xl text-xs font-heading font-semibold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-heading font-bold text-base text-slate-900 mb-2">
              Delete {deleteTarget.type === "showcase" ? "Showcase Photo" : "Milestone"}?
            </h3>
            <p className="font-body text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to remove this item? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-xl text-xs font-heading font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
