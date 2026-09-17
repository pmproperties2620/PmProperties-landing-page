"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  MessageSquareQuote,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Upload,
  X,
  AlertCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { useAdminAuth } from "../AdminAuthContext";
import { compressImage } from "@/lib/compressImage";

interface TestimonialRow {
  id: string;
  client_name: string | null;
  image_url: string;
  is_published: boolean;
  display_order: number;
  created_at: string;
}

const DEFAULT_FORM_DATA = {
  client_name: "",
  image_url: "",
  is_published: true,
  display_order: 0,
};

export default function AdminTestimonialsPage() {
  const { passcode } = useAdminAuth();

  const [testimonials, setTestimonials] = useState<TestimonialRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch testimonials list
  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        headers: { "x-admin-passcode": passcode },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonials(data.testimonials || []);
        setIsTableMissing(Boolean(data.tableMissing));
      } else {
        showToast("error", data.error || "Failed to load testimonials.");
      }
    } catch {
      showToast("error", "Error contacting testimonials server.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [passcode, showToast]);

  useEffect(() => {
    if (!passcode) return;
    let ignore = false;

    fetch("/api/admin/testimonials", {
      headers: { "x-admin-passcode": passcode },
    })
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        if (data && data.success) {
          setTestimonials(data.testimonials || []);
          setIsTableMissing(Boolean(data.tableMissing));
        } else {
          showToast("error", (data && data.error) || "Failed to load testimonials.");
        }
      })
      .catch((err) => {
        if (ignore) return;
        console.error("Failed to load testimonials:", err);
        showToast("error", "Error contacting testimonials server.");
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

  // Open Add modal
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...DEFAULT_FORM_DATA,
      display_order: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (item: TestimonialRow) => {
    setEditingId(item.id);
    setFormData({
      client_name: item.client_name || "",
      image_url: item.image_url,
      is_published: item.is_published,
      display_order: item.display_order,
    });
    setIsModalOpen(true);
  };

  // Upload image
  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const optimized = await compressImage(file);
      const uploadData = new FormData();
      uploadData.append("file", optimized);
      uploadData.append("folder", "testimonials");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-passcode": passcode },
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.publicUrl) {
        setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));
        showToast("success", "Testimonial photo optimized and uploaded.");
      } else {
        showToast("error", data.error || "Failed to upload image.");
      }
    } catch {
      showToast("error", "Network error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  // Quick toggle publish
  const handleTogglePublish = async (item: TestimonialRow) => {
    try {
      const updatedValue = !item.is_published;
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          id: item.id,
          is_published: updatedValue,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonials((prev) =>
          prev.map((t) => (t.id === item.id ? { ...t, is_published: updatedValue } : t))
        );
        showToast("success", `Testimonial ${updatedValue ? "published" : "hidden (draft)"}.`);
      } else {
        showToast("error", data.error || "Failed to update status.");
      }
    } catch {
      showToast("error", "Network error updating status.");
    }
  };

  // Save form
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url.trim()) {
      showToast("error", "Testimonial image is required.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        display_order: Number(formData.display_order) || 0,
      };

      if (editingId) {
        const res = await fetch("/api/admin/testimonials", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passcode": passcode,
          },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setTestimonials((prev) =>
            prev.map((t) => (t.id === editingId ? data.testimonial : t))
          );
          setIsModalOpen(false);
          showToast("success", "Testimonial updated successfully.");
        } else {
          showToast("error", data.error || "Failed to update testimonial.");
        }
      } else {
        const res = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passcode": passcode,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setTestimonials((prev) => [...prev, data.testimonial]);
          setIsModalOpen(false);
          showToast("success", "New testimonial added successfully.");
        } else {
          showToast("error", data.error || "Failed to create testimonial.");
        }
      }
    } catch {
      showToast("error", "Error saving testimonial.");
    } finally {
      setIsSaving(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/testimonials?id=${deleteId}`, {
        method: "DELETE",
        headers: { "x-admin-passcode": passcode },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
        setDeleteId(null);
        showToast("success", "Testimonial deleted successfully.");
      } else {
        showToast("error", data.error || "Failed to delete testimonial.");
      }
    } catch {
      showToast("error", "Network error deleting testimonial.");
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
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Client Testimonials
            </h1>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              Manage client review snapshots and happy family handover photos displayed on the Homepage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsRefreshing(true);
              fetchTestimonials();
            }}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-600" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-heading font-semibold text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Testimonial</span>
          </button>
        </div>
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
                Execute the SQL script from <code className="px-1.5 py-0.5 bg-amber-200/60 rounded text-amber-950 font-mono font-semibold">supabase/schema.sql</code> in your Supabase SQL Editor to enable live database persistence for testimonials. The live site will safely fall back to bundled photos in the meantime.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsRefreshing(true);
              fetchTestimonials();
            }}
            className="shrink-0 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-heading font-semibold rounded-xl"
          >
            Check Status
          </button>
        </div>
      )}

      {/* Testimonials Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
          <p className="font-heading text-sm text-slate-500">Loading testimonials...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <MessageSquareQuote className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-base text-slate-800">No Testimonials Yet</h3>
          <p className="font-body text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Add client handover photos or review cards to showcase real success stories on the live site.
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-heading font-semibold hover:bg-brand-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add First Testimonial</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden group">
                <Image
                  src={item.image_url}
                  alt={item.client_name || "Testimonial"}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider ${
                    item.is_published
                      ? "bg-emerald-500/90 text-white backdrop-blur-xs"
                      : "bg-slate-700/90 text-white backdrop-blur-xs"
                  }`}
                >
                  {item.is_published ? "Published" : "Draft"}
                </span>
                <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-heading font-bold bg-black/60 text-white backdrop-blur-xs">
                  #{item.display_order}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-heading font-bold text-sm text-slate-900 truncate">
                    {item.client_name || "Happy Client"}
                  </h4>
                  <p className="font-mono text-[10px] text-slate-400 truncate mt-0.5">
                    {item.image_url}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(item)}
                    className="text-xs font-heading font-medium text-slate-600 hover:text-brand-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.is_published ? "Unpublish" : "Publish"}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteId(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                {editingId ? "Edit Testimonial" : "Add Testimonial"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Single Image Slot Pattern with Live WebP Compression */}
              <div>
                <label className="block text-xs font-heading font-semibold text-slate-700 mb-1.5">
                  Testimonial Image *
                </label>
                <div className="flex gap-3 items-start">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0">
                    {formData.image_url ? (
                      <Image
                        src={formData.image_url}
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
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="Paste image URL or upload below..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                    />

                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-semibold cursor-pointer transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{isUploading ? "Compressing & Uploading..." : "Upload & Optimize"}</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,image/avif"
                          disabled={isUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file);
                          }}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-slate-400">
                        Auto-WebP (~300KB)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Name / Label */}
              <div>
                <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                  Client Name / Alt Caption
                </label>
                <input
                  type="text"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  placeholder="e.g. Mr. & Mrs. Sharma or Happy Buyer"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Display Order & Publish Toggle */}
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) =>
                      setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex items-end">
                  <label className="inline-flex items-center gap-2 cursor-pointer pb-2">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) =>
                        setFormData({ ...formData, is_published: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-xs font-heading font-semibold text-slate-700">
                      Publish to Website
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-heading font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || isUploading}
                  className="px-5 py-2 rounded-xl text-xs font-heading font-semibold text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
                >
                  {isSaving ? "Saving..." : editingId ? "Update Testimonial" : "Add Testimonial"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-heading font-bold text-base text-slate-900 mb-2">
              Delete Testimonial?
            </h3>
            <p className="font-body text-xs text-slate-500 mb-6 leading-relaxed">
              Are you sure you want to remove this testimonial? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-heading font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
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
