"use client";

import { Search, RotateCcw, SlidersHorizontal, Check } from "lucide-react";
import { useState } from "react";

export interface FilterState {
  search: string;
  category: string;
  city: string;
  config: string;
  budget: string;
  possession: string;
}

interface ProjectFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onReset: () => void;
  totalCount: number;
  filteredCount: number;
}

const CATEGORIES = [
  { id: "all", label: "All Properties" },
  { id: "Buy", label: "Buy (New Projects)" },
  { id: "Resale", label: "Verified Resale" },
  { id: "Commercial", label: "Commercial Hubs" },
  { id: "Rental", label: "Industrial & Rental" },
];

const CITIES = [
  { id: "all", label: "All Locations" },
  { id: "Kalyan", label: "Kalyan" },
  { id: "Dombivli", label: "Dombivli" },
  { id: "Thane", label: "Thane" },
  { id: "Badlapur", label: "Badlapur" },
  { id: "Bhiwandi", label: "Bhiwandi" },
];

const CONFIGS = [
  { id: "all", label: "All Configurations" },
  { id: "1 BHK", label: "1 BHK" },
  { id: "2 BHK", label: "2 BHK" },
  { id: "3 BHK", label: "3 BHK" },
  { id: "4+ BHK", label: "4+ BHK / Sky Villa" },
  { id: "Commercial", label: "Commercial / Office" },
];

const BUDGETS = [
  { id: "all", label: "All Budgets" },
  { id: "under-50l", label: "Under ₹50 Lakhs" },
  { id: "50l-1cr", label: "₹50 Lakhs - ₹1 Cr" },
  { id: "1cr-2cr", label: "₹1 Cr - ₹2 Cr" },
  { id: "above-2cr", label: "₹2 Cr & Above" },
];

const POSSESSIONS = [
  { id: "all", label: "All Stages" },
  { id: "Ready to Move", label: "Ready to Move" },
  { id: "Under Construction", label: "Under Construction" },
];

export default function ProjectFilters({
  filters,
  onFilterChange,
  onReset,
  totalCount,
  filteredCount,
}: ProjectFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const hasActiveFilters =
    Boolean(filters.search) ||
    filters.category !== "all" ||
    filters.city !== "all" ||
    filters.config !== "all" ||
    filters.budget !== "all" ||
    filters.possession !== "all";

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 mb-10">
      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 border-b border-slate-100 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = filters.category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onFilterChange({ category: cat.id })}
              className={`px-4 py-2 rounded-xl font-heading font-semibold text-xs sm:text-sm leading-none whitespace-nowrap transition-all ${
                isActive
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Main Search Bar & Quick Filters */}
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search by project name, developer (e.g. Regency, Lodha, Runwal), or locality..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 font-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 placeholder:text-slate-400"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: "" })}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-heading font-medium text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <select
          value={filters.city}
          onChange={(e) => onFilterChange({ city: e.target.value })}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 font-heading font-medium text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          {CITIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Budget Dropdown */}
        <select
          value={filters.budget}
          onChange={(e) => onFilterChange({ budget: e.target.value })}
          className="px-3.5 py-2.5 rounded-xl border border-slate-200 font-heading font-medium text-xs sm:text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          {BUDGETS.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>

        {/* Toggle Advanced Filters */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border font-heading font-medium text-xs sm:text-sm leading-none transition-colors ${
            showAdvanced || filters.config !== "all" || filters.possession !== "all"
              ? "border-brand-500 text-brand-600 bg-brand-50/50"
              : "border-slate-200 text-slate-700 bg-white hover:bg-slate-50"
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>More Filters</span>
        </button>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl font-heading font-medium text-xs sm:text-sm leading-none text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Configuration filter */}
          <div>
            <span className="block font-heading font-semibold text-xs text-slate-500 mb-2">
              Unit Configuration
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CONFIGS.map((cfg) => {
                const isSelected = filters.config === cfg.id;
                return (
                  <button
                    key={cfg.id}
                    onClick={() => onFilterChange({ config: cfg.id })}
                    className={`px-3 py-1.5 rounded-lg font-heading font-medium text-xs transition-colors flex items-center gap-1 ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Possession Status Filter */}
          <div>
            <span className="block font-heading font-semibold text-xs text-slate-500 mb-2">
              Possession Status
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POSSESSIONS.map((pos) => {
                const isSelected = filters.possession === pos.id;
                return (
                  <button
                    key={pos.id}
                    onClick={() => onFilterChange({ possession: pos.id })}
                    className={`px-3 py-1.5 rounded-lg font-heading font-medium text-xs transition-colors flex items-center gap-1 ${
                      isSelected
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    {pos.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Result Count and Summary */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between font-body text-xs text-slate-500">
        <div>
          Showing <span className="font-heading font-bold text-slate-900">{filteredCount}</span> of{" "}
          <span className="font-heading font-bold text-slate-900">{totalCount}</span> curated properties
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Zero Brokerage on Direct Builder Bookings</span>
        </div>
      </div>
    </div>
  );
}
