"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Layers,
  RefreshCw,
  Upload,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { useAdminAuth } from "../AdminAuthContext";
import { compressImage } from "@/lib/compressImage";

interface BannerSlot {
  page_key: string;
  label: string;
  image_url: string;
}

export default function AdminBannersPage() {
  const { passcode } = useAdminAuth();

  const [banners, setBanners] = useState<BannerSlot[]>([]);
  const [heroShowcaseUrl, setHeroShowcaseUrl] = useState<string>("/images/hero_img_right.png");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Active uploading states
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [savingKey, setSavingKey] = useState<string | null>(null);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/banners", {
        headers: { "x-admin-passcode": passcode },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBanners(data.banners || []);
        if (data.heroShowcase?.image_url) {
          setHeroShowcaseUrl(data.heroShowcase.image_url);
        }
        setIsTableMissing(Boolean(data.tableMissing));
      } else {
        showToast("error", data.error || "Failed to load banners.");
      }
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

    fetch("/api/admin/banners", {
      headers: { "x-admin-passcode": passcode },
    })
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        if (data && data.success) {
          setBanners(data.banners || []);
          if (data.heroShowcase?.image_url) {
            setHeroShowcaseUrl(data.heroShowcase.image_url);
          }
          setIsTableMissing(Boolean(data.tableMissing));
        } else {
          showToast("error", (data && data.error) || "Failed to load banners.");
        }
      })
      .catch((err) => {
        if (ignore) return;
        console.error("Failed to load banners:", err);
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

  // Upload single image with client-side WebP compression
  const handleUploadBannerImage = async (file: File, pageKey: string, folder = "banners") => {
    try {
      setUploadingKey(pageKey);
      const optimized = await compressImage(file);
      const uploadData = new FormData();
      uploadData.append("file", optimized);
      uploadData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-passcode": passcode },
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.publicUrl) {
        if (pageKey === "hero_showcase") {
          setHeroShowcaseUrl(data.publicUrl);
          await handleSaveHeroShowcase(data.publicUrl);
        } else {
          setBanners((prev) =>
            prev.map((b) => (b.page_key === pageKey ? { ...b, image_url: data.publicUrl } : b))
          );
          await handleSaveBanner(pageKey, data.publicUrl);
        }
        showToast("success", "Banner image optimized and saved.");
      } else {
        showToast("error", data.error || "Failed to upload image.");
      }
    } catch {
      showToast("error", "Network error uploading image.");
    } finally {
      setUploadingKey(null);
    }
  };

  // Save Page Banner URL
  const handleSaveBanner = async (pageKey: string, urlOverride?: string) => {
    const banner = banners.find((b) => b.page_key === pageKey);
    const imageUrl = urlOverride || banner?.image_url;

    if (!imageUrl) return;

    try {
      setSavingKey(pageKey);
      const res = await fetch("/api/admin/banners", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          page_key: pageKey,
          image_url: imageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("success", `${banner?.label || pageKey} updated.`);
      } else {
        showToast("error", data.error || "Failed to save banner.");
      }
    } catch {
      showToast("error", "Error saving banner.");
    } finally {
      setSavingKey(null);
    }
  };

  // Save Hero Showcase URL
  const handleSaveHeroShowcase = async (urlOverride?: string) => {
    const imageUrl = urlOverride || heroShowcaseUrl;
    if (!imageUrl) return;

    try {
      setSavingKey("hero_showcase");
      const res = await fetch("/api/admin/banners", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          type: "hero_showcase",
          hero_image_url: imageUrl,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("success", "Hero Right Showcase image updated.");
      } else {
        showToast("error", data.error || "Failed to save showcase.");
      }
    } catch {
      showToast("error", "Error saving showcase.");
    } finally {
      setSavingKey(null);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
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
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              Page Banners & Hero Showcase
            </h1>
            <p className="font-body text-xs sm:text-sm text-slate-500">
              Manage hero fold background banners across every public page, plus the Homepage luxury showcase card.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setIsRefreshing(true);
            fetchBanners();
          }}
          disabled={isRefreshing}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer self-start sm:self-auto"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-600" : ""}`} />
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
                Run the script in <code className="px-1.5 py-0.5 bg-amber-200/60 rounded text-amber-950 font-mono font-semibold">supabase/schema.sql</code> to create the <code className="px-1 py-0.5 bg-amber-200/60 rounded font-mono">page_banners</code> and <code className="px-1 py-0.5 bg-amber-200/60 rounded font-mono">hero_showcase</code> tables.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsRefreshing(true);
              fetchBanners();
            }}
            className="shrink-0 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-heading font-semibold rounded-xl"
          >
            Check Status
          </button>
        </div>
      )}

      {/* SECTION 1: Homepage Hero Showcase Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
          <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900">
              Homepage Hero Right Showcase Card
            </h2>
            <p className="font-body text-xs text-slate-500">
              The flagship luxury property photograph featured prominently on the right-hand card of the homepage fold.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Card Preview Box */}
          <div className="md:col-span-5 lg:col-span-4 w-full">
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm">
              {heroShowcaseUrl ? (
                <Image
                  src={heroShowcaseUrl}
                  alt="Hero Showcase Preview"
                  fill
                  sizes="(max-width: 768px) 100vw, 360px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                  <ImageIcon className="w-6 h-6 mb-1 text-slate-300" />
                  <span>No Image Set</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="md:col-span-7 lg:col-span-8 space-y-3.5 w-full min-w-0">
            <div>
              <label className="block text-xs font-heading font-semibold text-slate-700 mb-1.5">
                Showcase Image URL
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={heroShowcaseUrl}
                  onChange={(e) => setHeroShowcaseUrl(e.target.value)}
                  placeholder="Paste URL or upload image below..."
                  className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={() => handleSaveHeroShowcase()}
                  disabled={savingKey === "hero_showcase"}
                  className="shrink-0 px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-heading font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  {savingKey === "hero_showcase" ? "Saving..." : "Save URL"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-heading font-semibold cursor-pointer transition-colors shadow-sm">
                <Upload className="w-4 h-4" />
                <span>
                  {uploadingKey === "hero_showcase" ? "Compressing & Uploading..." : "Upload New Photo"}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  disabled={uploadingKey === "hero_showcase"}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadBannerImage(file, "hero_showcase", "hero");
                  }}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-400 font-body">
                Auto-optimized to WebP (~300KB)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Page Hero Banners */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="font-heading font-bold text-base sm:text-lg text-slate-900">
            Page Hero Backdrop Banners
          </h2>
          <p className="font-body text-xs text-slate-500">
            Underlying background photographs rendered beneath the gradient overlays on each primary page route.
          </p>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <RefreshCw className="w-8 h-8 text-brand-600 animate-spin mx-auto mb-3" />
            <p className="font-heading text-sm text-slate-500">Loading page banners...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banners.map((slot) => (
              <div
                key={slot.page_key}
                className="bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4.5 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <h3 className="font-heading font-bold text-sm text-slate-900">
                      {slot.label}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-white border border-slate-200 text-slate-600">
                      {slot.page_key}
                    </span>
                  </div>

                  <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-200 border border-slate-200/80 mb-3">
                    <Image
                      src={slot.image_url}
                      alt={slot.label}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={slot.image_url}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBanners((prev) =>
                          prev.map((b) =>
                            b.page_key === slot.page_key ? { ...b, image_url: val } : b
                          )
                        );
                      }}
                      placeholder="Paste image URL..."
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-body bg-white focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveBanner(slot.page_key)}
                      disabled={savingKey === slot.page_key}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-heading font-semibold rounded-xl cursor-pointer"
                    >
                      {savingKey === slot.page_key ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200/60 pt-3">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-heading font-semibold cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>
                      {uploadingKey === slot.page_key ? "Uploading..." : "Upload Device File"}
                    </span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      disabled={uploadingKey === slot.page_key}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadBannerImage(file, slot.page_key, "banners");
                      }}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[10px] text-slate-400 font-body">WebP Optimized</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
