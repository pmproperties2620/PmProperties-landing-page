"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  Star,
  Upload,
  X,
  Check,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Tag,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAdminAuth } from "../AdminAuthContext";
import { ProjectRow, ProjectDbCategory, ProjectDbStatus } from "@/lib/supabaseServer";
import { compressImage } from "@/lib/compressImage";

const POPULAR_AMENITIES = [
  "Infinity Swimming Pool",
  "State-of-the-Art Gymnasium",
  "Grand Clubhouse",
  "Landscaped Podium Gardens",
  "Children's Play Area",
  "Jogging Track",
  "24/7 Security & CCTV",
  "Power Backup",
  "Badminton Court",
  "Indoor Games Room",
  "Yoga & Meditation Deck",
  "High-Speed Elevators",
];

const POPULAR_CONFIGS = [
  "1 RK",
  "1 BHK",
  "2 BHK",
  "3 BHK",
  "4 BHK",
  "Duplex",
  "Penthouse",
  "Commercial Shop",
  "Office Space",
  "Showroom",
  "Industrial Gala",
];

const DEFAULT_FORM_DATA = {
  project_name: "",
  developer_name: "",
  location: "",
  address: "",
  category: "buy_new" as ProjectDbCategory,
  status: "ready_to_move" as ProjectDbStatus,
  brokerage_label: "0% Brokerage",
  is_featured: false,
  rera_number: "",
  rera_verified: true,
  price_min: "",
  price_max: "",
  price_unit: "Lakhs",
  price_per_sqft: "",
  configurations: ["1 BHK", "2 BHK"] as string[],
  property_type: "Residential",
  carpet_area_min: "",
  carpet_area_max: "",
  rera_usable: true,
  possession_text: "Immediate Possession",
  possession_status_tag: "Ready to Move",
  description: "",
  highlights: [] as string[],
  amenities: [] as string[],
  cover_image_url: "",
  gallery_image_urls: [] as string[],
  brochure_url: "",
  contact_phone: "919029923246",
  is_published: true,
  display_order: 0,
};

export default function AdminProjectsPage() {
  const { passcode } = useAdminAuth();

  // Data & Loading state
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [publicationFilter, setPublicationFilter] = useState("all");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Inline Tag Inputs
  const [newConfigInput, setNewConfigInput] = useState("");
  const [newHighlightInput, setNewHighlightInput] = useState("");
  const [newAmenityInput, setNewAmenityInput] = useState("");
  const [newGalleryUrlInput, setNewGalleryUrlInput] = useState("");

  // Delete Confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Show toast notification
  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  // Fetch projects list
  const fetchProjects = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/projects", {
        headers: {
          "x-admin-passcode": passcode,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects(data.projects || []);
        setIsTableMissing(Boolean(data.tableMissing));
      } else {
        showToast("error", data.error || "Failed to load projects.");
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
      showToast("error", "Error contacting projects server.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [passcode, showToast]);

  useEffect(() => {
    if (!passcode) return;
    let ignore = false;

    fetch("/api/admin/projects", {
      headers: {
        "x-admin-passcode": passcode,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (ignore) return;
        if (data && data.success) {
          setProjects(data.projects || []);
          setIsTableMissing(Boolean(data.tableMissing));
        } else {
          showToast("error", (data && data.error) || "Failed to load projects.");
        }
      })
      .catch((err) => {
        if (ignore) return;
        console.error("Failed to load projects:", err);
        showToast("error", "Error contacting projects server.");
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

  // Open Add Project Modal
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...DEFAULT_FORM_DATA,
      display_order: projects.length,
    });
    setIsModalOpen(true);
  };

  // Open Edit Project Modal
  const handleOpenEdit = (project: ProjectRow) => {
    setEditingId(project.id);
    setFormData({
      project_name: project.project_name || "",
      developer_name: project.developer_name || "",
      location: project.location || "",
      address: project.address || "",
      category: (project.category as ProjectDbCategory) || "buy_new",
      status: (project.status as ProjectDbStatus) || "ready_to_move",
      brokerage_label: project.brokerage_label || "0% Brokerage",
      is_featured: Boolean(project.is_featured),
      rera_number: project.rera_number || "",
      rera_verified: Boolean(project.rera_verified),
      price_min: project.price_min ? String(project.price_min) : "",
      price_max: project.price_max ? String(project.price_max) : "",
      price_unit: project.price_unit || "Lakhs",
      price_per_sqft: project.price_per_sqft ? String(project.price_per_sqft) : "",
      configurations: Array.isArray(project.configurations) ? [...project.configurations] : [],
      property_type: project.property_type || "Residential",
      carpet_area_min: project.carpet_area_min ? String(project.carpet_area_min) : "",
      carpet_area_max: project.carpet_area_max ? String(project.carpet_area_max) : "",
      rera_usable: Boolean(project.rera_usable),
      possession_text: project.possession_text || "",
      possession_status_tag: project.possession_status_tag || "",
      description: project.description || "",
      highlights: Array.isArray(project.highlights) ? [...project.highlights] : [],
      amenities: Array.isArray(project.amenities) ? [...project.amenities] : [],
      cover_image_url: project.cover_image_url || "",
      gallery_image_urls: Array.isArray(project.gallery_image_urls)
        ? [...project.gallery_image_urls]
        : [],
      brochure_url: project.brochure_url || "",
      contact_phone: project.contact_phone || "919029923246",
      is_published: Boolean(project.is_published),
      display_order: Number(project.display_order) || 0,
    });
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  // Quick Toggle Publish
  const handleTogglePublish = async (project: ProjectRow) => {
    try {
      const updatedValue = !project.is_published;
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          id: project.id,
          is_published: updatedValue,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, is_published: updatedValue } : p))
        );
        showToast(
          "success",
          `Project ${updatedValue ? "published to website" : "unpublished (saved as draft)"}.`
        );
      } else {
        showToast("error", data.error || "Failed to update project status.");
      }
    } catch {
      showToast("error", "Error updating project status.");
    }
  };

  // Quick Toggle Featured
  const handleToggleFeatured = async (project: ProjectRow) => {
    try {
      const updatedValue = !project.is_featured;
      const res = await fetch("/api/admin/projects", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-admin-passcode": passcode,
        },
        body: JSON.stringify({
          id: project.id,
          is_featured: updatedValue,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === project.id ? { ...p, is_featured: updatedValue } : p))
        );
        showToast(
          "success",
          `Project ${updatedValue ? "marked as Featured" : "unmarked from Featured"}.`
        );
      } else {
        showToast("error", data.error || "Failed to update featured flag.");
      }
    } catch {
      showToast("error", "Error updating featured flag.");
    }
  };

  // Handle Form Submit (Insert or Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.project_name.trim()) {
      showToast("error", "Project Name is required.");
      return;
    }
    if (!formData.developer_name.trim()) {
      showToast("error", "Developer Name is required.");
      return;
    }
    if (!formData.location.trim()) {
      showToast("error", "Location is required.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        ...formData,
        price_min: formData.price_min ? Number(formData.price_min) : null,
        price_max: formData.price_max ? Number(formData.price_max) : null,
        price_per_sqft: formData.price_per_sqft ? Number(formData.price_per_sqft) : null,
        carpet_area_min: formData.carpet_area_min ? Number(formData.carpet_area_min) : null,
        carpet_area_max: formData.carpet_area_max ? Number(formData.carpet_area_max) : null,
        display_order: Number(formData.display_order) || 0,
      };

      if (editingId) {
        // Update
        const res = await fetch("/api/admin/projects", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passcode": passcode,
          },
          body: JSON.stringify({ id: editingId, ...payload }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProjects((prev) =>
            prev.map((p) => (p.id === editingId ? (data.project as ProjectRow) : p))
          );
          showToast("success", `Project "${formData.project_name}" updated successfully.`);
          setIsModalOpen(false);
        } else {
          showToast("error", data.error || "Failed to update project.");
        }
      } else {
        // Insert
        const res = await fetch("/api/admin/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-admin-passcode": passcode,
          },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          setProjects((prev) => [data.project as ProjectRow, ...prev]);
          showToast("success", `Project "${formData.project_name}" created successfully.`);
          setIsModalOpen(false);
        } else {
          showToast("error", data.error || "Failed to create project.");
        }
      }
    } catch {
      showToast("error", "Error saving project.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/admin/projects?id=${deleteId}`, {
        method: "DELETE",
        headers: {
          "x-admin-passcode": passcode,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== deleteId));
        showToast("success", "Project deleted successfully.");
        setDeleteId(null);
      } else {
        showToast("error", data.error || "Failed to delete project.");
      }
    } catch {
      showToast("error", "Error deleting project.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Image Upload helper
  const handleImageUpload = async (
    file: File,
    type: "cover" | "gallery"
  ) => {
    try {
      if (type === "cover") setIsUploadingCover(true);
      else setIsUploadingGallery(true);

      const optimizedFile = await compressImage(file);
      const uploadData = new FormData();
      uploadData.append("file", optimizedFile);

      const res = await fetch("/api/admin/projects/upload", {
        method: "POST",
        headers: {
          "x-admin-passcode": passcode,
        },
        body: uploadData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.publicUrl) {
        if (type === "cover") {
          setFormData((prev) => ({ ...prev, cover_image_url: data.publicUrl }));
          showToast("success", "Cover image uploaded successfully.");
        } else {
          setFormData((prev) => ({
            ...prev,
            gallery_image_urls: [...prev.gallery_image_urls, data.publicUrl],
          }));
          showToast("success", "Gallery image added successfully.");
        }
      } else {
        showToast("error", data.error || "Failed to upload image.");
      }
    } catch {
      showToast("error", "Network error during image upload.");
    } finally {
      if (type === "cover") setIsUploadingCover(false);
      else setIsUploadingGallery(false);
    }
  };

  // Add / Remove Configurations
  const handleAddConfig = () => {
    if (newConfigInput.trim() && !formData.configurations.includes(newConfigInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        configurations: [...prev.configurations, newConfigInput.trim()],
      }));
      setNewConfigInput("");
    }
  };

  const handleRemoveConfig = (config: string) => {
    setFormData((prev) => ({
      ...prev,
      configurations: prev.configurations.filter((c) => c !== config),
    }));
  };

  // Add / Remove Highlights
  const handleAddHighlight = () => {
    if (newHighlightInput.trim() && !formData.highlights.includes(newHighlightInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        highlights: [...prev.highlights, newHighlightInput.trim()],
      }));
      setNewHighlightInput("");
    }
  };

  const handleRemoveHighlight = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((h) => h !== item),
    }));
  };

  // Add / Remove Amenities
  const handleAddAmenity = (name: string) => {
    if (name.trim() && !formData.amenities.includes(name.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, name.trim()],
      }));
    }
  };

  const handleRemoveAmenity = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a) => a !== name),
    }));
  };

  // Add / Remove Gallery URL
  const handleAddGalleryUrl = () => {
    if (newGalleryUrlInput.trim() && !formData.gallery_image_urls.includes(newGalleryUrlInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        gallery_image_urls: [...prev.gallery_image_urls, newGalleryUrlInput.trim()],
      }));
      setNewGalleryUrlInput("");
    }
  };

  const handleRemoveGalleryUrl = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      gallery_image_urls: prev.gallery_image_urls.filter((u) => u !== url),
    }));
  };

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      // Search
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = (p.project_name || "").toLowerCase().includes(q);
        const matchesDev = (p.developer_name || "").toLowerCase().includes(q);
        const matchesLoc = (p.location || "").toLowerCase().includes(q);
        const matchesAddr = (p.address || "").toLowerCase().includes(q);
        if (!matchesName && !matchesDev && !matchesLoc && !matchesAddr) return false;
      }

      // Category
      if (categoryFilter !== "all" && p.category !== categoryFilter) {
        return false;
      }

      // Status
      if (statusFilter !== "all" && p.status !== statusFilter) {
        return false;
      }

      // Publication
      if (publicationFilter === "published" && !p.is_published) return false;
      if (publicationFilter === "draft" && p.is_published) return false;

      return true;
    });
  }, [projects, search, categoryFilter, statusFilter, publicationFilter]);

  // Key stats
  const publishedCount = projects.filter((p) => p.is_published).length;
  const featuredCount = projects.filter((p) => p.is_featured).length;
  const readyCount = projects.filter((p) => p.status === "ready_to_move").length;

  return (
    <div className="space-y-6">
      {/* Toast alert */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-heading font-semibold text-white animate-in fade-in slide-in-from-top-4 duration-200 ${
            toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-brand-600 text-xs font-heading font-bold uppercase tracking-wider mb-1">
            <Building2 className="w-4 h-4" />
            <span>Content Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-slate-900 tracking-tight">
            Projects Catalog
          </h1>
          <p className="text-slate-500 font-body text-xs sm:text-sm mt-0.5">
            Manage real estate developments, configurations, pricing, and showcase imagery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setIsRefreshing(true);
              fetchProjects();
            }}
            disabled={isRefreshing}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh Projects"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-brand-600" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 active:scale-[0.99] text-white px-4 py-2.5 rounded-xl font-heading font-semibold text-sm shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Database Initialization Notice if table is missing in Supabase */}
      {isTableMissing && (
        <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-xl shrink-0 mt-0.5 sm:mt-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading font-bold text-sm text-amber-900">
                Database Schema Ready to Run in Supabase
              </h4>
              <p className="font-body text-xs text-amber-800 mt-0.5 leading-relaxed">
                The <code className="px-1.5 py-0.5 bg-amber-200/60 rounded text-amber-950 font-mono font-semibold">projects</code> table and <code className="px-1.5 py-0.5 bg-amber-200/60 rounded text-amber-950 font-mono font-semibold">project-images</code> storage bucket definitions are ready in <code className="px-1.5 py-0.5 bg-amber-200/60 rounded text-amber-950 font-mono font-semibold">supabase/schema.sql</code>. Copy & execute the script in your Supabase Dashboard SQL Editor to enable full live cloud database storage.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsRefreshing(true);
              fetchProjects();
            }}
            className="shrink-0 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-heading font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Check Status
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">
            Total Projects
          </p>
          <p className="text-2xl font-heading font-extrabold text-slate-900 mt-1">
            {projects.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">
            Live on Website
          </p>
          <p className="text-2xl font-heading font-extrabold text-emerald-600 mt-1">
            {publishedCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">
            Featured Highlights
          </p>
          <p className="text-2xl font-heading font-extrabold text-amber-600 mt-1">
            {featuredCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-heading font-semibold text-slate-400 uppercase tracking-wider">
            Ready to Move
          </p>
          <p className="text-2xl font-heading font-extrabold text-indigo-600 mt-1">
            {readyCount}
          </p>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project name, developer, or location..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-body text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-heading font-semibold text-slate-700 bg-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="buy_new">Direct Builder (Buy)</option>
              <option value="verified_resale">Verified Resale</option>
              <option value="commercial">Commercial Hub</option>
              <option value="industrial_rental">Industrial & Rental</option>
            </select>

            {/* Status Dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-heading font-semibold text-slate-700 bg-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="ready_to_move">Ready to Move</option>
              <option value="under_construction">Under Construction</option>
            </select>

            {/* Publication Dropdown */}
            <select
              value={publicationFilter}
              onChange={(e) => setPublicationFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-heading font-semibold text-slate-700 bg-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="all">All Visibility</option>
              <option value="published">Published Only</option>
              <option value="draft">Draft Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Table / Cards */}
      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-xs font-heading font-semibold uppercase tracking-wider text-slate-400">
            Loading Projects...
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">No Projects Found</h3>
          <p className="font-body text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {search || categoryFilter !== "all" || statusFilter !== "all"
              ? "No projects match your current search or filter criteria. Try resetting your filters."
              : "You have not added any real estate projects yet. Click '+ Add New Project' to create your first project."}
          </p>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="mt-5 inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-heading font-semibold text-xs uppercase tracking-wider shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Project</span>
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-heading font-bold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Order</th>
                  <th className="py-3.5 px-4">Project & Developer</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Category & Status</th>
                  <th className="py-3.5 px-4">Pricing Range</th>
                  <th className="py-3.5 px-4">Configurations</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    className="hover:bg-slate-50/60 transition-colors font-body"
                  >
                    {/* Order Index */}
                    <td className="py-3.5 px-4 font-heading font-bold text-xs text-slate-400">
                      #{project.display_order}
                    </td>

                    {/* Project & Developer with Thumbnail */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                          <Image
                            src={project.cover_image_url || "/images/modern_building.png"}
                            alt={project.project_name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-heading font-bold text-slate-900 text-sm">
                              {project.project_name}
                            </span>
                            {project.is_featured && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-heading font-semibold">
                                <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {project.developer_name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-4 text-slate-600 text-xs">
                      <div className="flex items-center gap-1.5 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{project.location}</span>
                      </div>
                    </td>

                    {/* Category & Status */}
                    <td className="py-3.5 px-4">
                      <div className="space-y-1">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-heading font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {project.category === "buy_new"
                            ? "Buy New"
                            : project.category === "verified_resale"
                            ? "Resale"
                            : project.category === "commercial"
                            ? "Commercial"
                            : "Industrial/Rental"}
                        </span>
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-heading font-semibold ${
                              project.status === "ready_to_move"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {project.status === "ready_to_move"
                              ? "Ready to Move"
                              : "Under Construction"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3.5 px-4 font-heading font-bold text-xs text-slate-900">
                      {project.price_min && project.price_max
                        ? `₹${project.price_min} - ₹${project.price_max} ${project.price_unit}`
                        : project.price_min
                        ? `From ₹${project.price_min} ${project.price_unit}`
                        : "Price on Request"}
                    </td>

                    {/* Configurations */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {project.configurations?.slice(0, 3).map((conf) => (
                          <span
                            key={conf}
                            className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-heading font-medium"
                          >
                            {conf}
                          </span>
                        ))}
                        {project.configurations && project.configurations.length > 3 && (
                          <span className="text-[10px] text-slate-400 font-heading font-medium">
                            +{project.configurations.length - 3}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Published Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(project)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-heading font-semibold cursor-pointer transition-colors ${
                          project.is_published
                            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200 border border-slate-300"
                        }`}
                        title="Click to toggle publish status"
                      >
                        {project.is_published ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Live</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(project)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            project.is_featured
                              ? "text-amber-500 hover:bg-amber-50"
                              : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                          }`}
                          title={project.is_featured ? "Remove from Featured" : "Mark as Featured"}
                        >
                          <Star
                            className={`w-4 h-4 ${
                              project.is_featured ? "fill-amber-500" : ""
                            }`}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenEdit(project)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors cursor-pointer"
                          title="Edit Project"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteId(project.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT PROJECT MODAL                                                 */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={handleCloseModal}
          />

          {/* Dialog Card */}
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 z-10 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div>
                <h2 className="font-heading font-bold text-lg text-slate-900">
                  {editingId ? "Edit Project Details" : "Add New Real Estate Project"}
                </h2>
                <p className="text-xs font-body text-slate-500">
                  Configure specifications, pricing, imagery, and promotional badges.
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitForm} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Basic Information */}
              <div>
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  <span>1. Basic Property Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.project_name}
                      onChange={(e) =>
                        setFormData({ ...formData, project_name: e.target.value })
                      }
                      placeholder="e.g. Regency Antilia"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Developer / Builder Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.developer_name}
                      onChange={(e) =>
                        setFormData({ ...formData, developer_name: e.target.value })
                      }
                      placeholder="e.g. Regency Group"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Locality / Suburb *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g. Khadakpada, Kalyan West"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Full Address / Landmark
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Near Regency Medical Centre, Kalyan West, Maharashtra"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category: e.target.value as ProjectDbCategory,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500 bg-white cursor-pointer"
                    >
                      <option value="buy_new">Direct Builder Booking (Buy New)</option>
                      <option value="verified_resale">Verified Resale</option>
                      <option value="commercial">Commercial Hub / Offices</option>
                      <option value="industrial_rental">Industrial & Warehousing Rental</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Construction Stage
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as ProjectDbStatus,
                        })
                      }
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500 bg-white cursor-pointer"
                    >
                      <option value="ready_to_move">Ready to Move</option>
                      <option value="under_construction">Under Construction</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Possession Text
                    </label>
                    <input
                      type="text"
                      value={formData.possession_text}
                      onChange={(e) =>
                        setFormData({ ...formData, possession_text: e.target.value })
                      }
                      placeholder="e.g. Immediate Possession or Dec 2026"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Brokerage Badge Label
                    </label>
                    <input
                      type="text"
                      value={formData.brokerage_label}
                      onChange={(e) =>
                        setFormData({ ...formData, brokerage_label: e.target.value })
                      }
                      placeholder="0% Brokerage"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Pricing & Configurations */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5">
                  <Tag className="w-4 h-4" />
                  <span>2. Pricing & Spatial Dimensions</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Min Price
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.price_min}
                      onChange={(e) => setFormData({ ...formData, price_min: e.target.value })}
                      placeholder="e.g. 85"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Max Price
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.price_max}
                      onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
                      placeholder="e.g. 1.45"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={formData.price_unit}
                      onChange={(e) => setFormData({ ...formData, price_unit: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500 bg-white cursor-pointer"
                    >
                      <option value="Lakhs">Lakhs (₹)</option>
                      <option value="Cr">Cr (₹)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Price / Sq.Ft. (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price_per_sqft}
                      onChange={(e) =>
                        setFormData({ ...formData, price_per_sqft: e.target.value })
                      }
                      placeholder="e.g. 9200"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Carpet Area Min (sq.ft.)
                    </label>
                    <input
                      type="number"
                      value={formData.carpet_area_min}
                      onChange={(e) =>
                        setFormData({ ...formData, carpet_area_min: e.target.value })
                      }
                      placeholder="e.g. 760"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Carpet Area Max (sq.ft.)
                    </label>
                    <input
                      type="number"
                      value={formData.carpet_area_max}
                      onChange={(e) =>
                        setFormData({ ...formData, carpet_area_max: e.target.value })
                      }
                      placeholder="e.g. 1180"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>

                {/* Configurations Tags */}
                <div className="mt-4">
                  <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                    Configurations
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.configurations.map((cfg) => (
                      <span
                        key={cfg}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 text-xs font-heading font-semibold"
                      >
                        <span>{cfg}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveConfig(cfg)}
                          className="hover:text-brand-900 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newConfigInput}
                      onChange={(e) => setNewConfigInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddConfig();
                        }
                      }}
                      placeholder="Type BHK config (e.g. 3 BHK) and hit Enter"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddConfig}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-heading font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Quick-add configurations chips */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {POPULAR_CONFIGS.map((popCfg) => {
                      const isAdded = formData.configurations.includes(popCfg);
                      return (
                        <button
                          key={popCfg}
                          type="button"
                          onClick={() => {
                            if (isAdded) handleRemoveConfig(popCfg);
                            else {
                              setFormData((prev) => ({
                                ...prev,
                                configurations: [...prev.configurations, popCfg],
                              }));
                            }
                          }}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-heading font-medium transition-colors cursor-pointer ${
                            isAdded
                              ? "bg-brand-600 text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isAdded ? `✓ ${popCfg}` : `+ ${popCfg}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Section 3: MahaRERA Compliance */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>3. MahaRERA Regulatory Compliance</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      MahaRERA Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.rera_number}
                      onChange={(e) =>
                        setFormData({ ...formData, rera_number: e.target.value })
                      }
                      placeholder="e.g. P51700015638"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.rera_verified}
                        onChange={(e) =>
                          setFormData({ ...formData, rera_verified: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-xs font-heading font-semibold text-slate-700">
                        Display &quot;100% MahaRERA Verified&quot; Trust Badge
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 4: Imagery & Brochure */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span>4. Project Imagery & Brochure Asset</span>
                </h3>

                {/* Cover Image */}
                <div className="space-y-2 mb-4">
                  <label className="block text-xs font-heading font-semibold text-slate-700">
                    Primary Cover Image *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 items-start">
                    {/* Image Preview Box */}
                    <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                      {formData.cover_image_url ? (
                        <Image
                          src={formData.cover_image_url}
                          alt="Cover preview"
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-[10px]">
                          <Upload className="w-4 h-4 mb-1" />
                          <span>No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Inputs */}
                    <div className="flex-1 space-y-2 w-full">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.cover_image_url}
                          onChange={(e) =>
                            setFormData({ ...formData, cover_image_url: e.target.value })
                          }
                          placeholder="Paste image URL or upload file below..."
                          className="flex-1 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:border-brand-500"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-semibold cursor-pointer transition-colors">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingCover ? "Uploading..." : "Upload from Device"}</span>
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            disabled={isUploadingCover}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, "cover");
                            }}
                            className="hidden"
                          />
                        </label>
                        <span className="text-[11px] text-slate-400 font-body">
                          Max 10MB (JPG, PNG, WebP)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="space-y-2 mb-4">
                  <label className="block text-xs font-heading font-semibold text-slate-700">
                    Additional Gallery Images
                  </label>

                  {/* Thumbnail Strip */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.gallery_image_urls.map((url, idx) => (
                      <div
                        key={idx}
                        className="group relative w-16 h-14 rounded-lg overflow-hidden border border-slate-200 bg-slate-100"
                      >
                        <Image
                          src={url}
                          alt={`Gallery ${idx + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryUrl(url)}
                          className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGalleryUrlInput}
                      onChange={(e) => setNewGalleryUrlInput(e.target.value)}
                      placeholder="Paste image URL and click Add"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-heading font-semibold cursor-pointer"
                    >
                      Add URL
                    </button>

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-heading font-semibold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingGallery ? "Uploading..." : "Upload File"}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        disabled={isUploadingGallery}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "gallery");
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Brochure URL */}
                <div>
                  <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                    Brochure PDF Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.brochure_url}
                    onChange={(e) => setFormData({ ...formData, brochure_url: e.target.value })}
                    placeholder="e.g. https://... or /brochures/project.pdf"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Section 5: Highlights, Amenities, & Description */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>5. Key Highlights & World-Class Amenities</span>
                </h3>

                {/* Highlights */}
                <div className="mb-4">
                  <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                    Key Project Highlights
                  </label>
                  <div className="space-y-1.5 mb-2">
                    {formData.highlights.map((hl, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-body text-slate-800"
                      >
                        <span className="flex-1">• {hl}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveHighlight(hl)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHighlightInput}
                      onChange={(e) => setNewHighlightInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddHighlight();
                        }
                      }}
                      placeholder="Type a highlight (e.g. Riverfront promenade with deck) and hit Enter"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddHighlight}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-heading font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {formData.amenities.map((am) => (
                      <span
                        key={am}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-heading font-semibold"
                      >
                        <span>{am}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveAmenity(am)}
                          className="hover:text-emerald-950 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAmenityInput}
                      onChange={(e) => setNewAmenityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newAmenityInput.trim()) {
                            handleAddAmenity(newAmenityInput.trim());
                            setNewAmenityInput("");
                          }
                        }
                      }}
                      placeholder="Type amenity and hit Enter"
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-body focus:outline-none focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newAmenityInput.trim()) {
                          handleAddAmenity(newAmenityInput.trim());
                          setNewAmenityInput("");
                        }
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-heading font-semibold cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Popular Amenities quick chips */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {POPULAR_AMENITIES.map((popAm) => {
                      const isAdded = formData.amenities.includes(popAm);
                      return (
                        <button
                          key={popAm}
                          type="button"
                          onClick={() => {
                            if (isAdded) handleRemoveAmenity(popAm);
                            else handleAddAmenity(popAm);
                          }}
                          className={`text-[11px] px-2 py-0.5 rounded-md font-heading font-medium transition-colors cursor-pointer ${
                            isAdded
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                          }`}
                        >
                          {isAdded ? `✓ ${popAm}` : `+ ${popAm}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                    Detailed Project Overview
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter thorough overview, architect info, lifestyle privileges..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-body text-slate-900 focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Section 6: Publishing & Ordering */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-heading font-bold uppercase tracking-wider text-brand-600 mb-3 flex items-center gap-1.5">
                  <Eye className="w-4 h-4" />
                  <span>6. Visibility & Display Order</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.is_published}
                        onChange={(e) =>
                          setFormData({ ...formData, is_published: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-xs font-heading font-semibold text-slate-700">
                        Published Live on Website
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) =>
                          setFormData({ ...formData, is_featured: e.target.checked })
                        }
                        className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500"
                      />
                      <span className="text-xs font-heading font-semibold text-slate-700">
                        Featured Highlight (Priority Badge)
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-semibold text-slate-700 mb-1">
                      Display Order (0 = top)
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          display_order: Number(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-body text-slate-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="border-t border-slate-200 pt-5 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-heading font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-heading font-semibold text-xs tracking-wider uppercase shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Project</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                */}
      {/* ========================================================================= */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setDeleteId(null)}
          />
          <div className="relative bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 z-10 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-base text-slate-900">
              Delete This Project?
            </h3>
            <p className="font-body text-xs text-slate-500 mt-1">
              This action cannot be undone. The project will be permanently removed from your catalog and public website.
            </p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-xs font-heading font-semibold cursor-pointer hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-heading font-semibold cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
