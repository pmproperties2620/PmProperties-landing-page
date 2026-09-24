"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Award, Calendar, Maximize2, X, Sparkles, CheckCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { IndustryPresenceItem } from "@/lib/contentQueries";

interface AchievementsGalleryProps {
  initialItems: IndustryPresenceItem[];
}

type CategoryType = "all" | "awards" | "expos" | "summits";

export default function AchievementsGallery({ initialItems }: AchievementsGalleryProps) {
  const [selectedFilter, setSelectedFilter] = useState<CategoryType>("all");
  const [activeModalItem, setActiveModalItem] = useState<IndustryPresenceItem | null>(null);

  const filterItems = (filter: CategoryType) => {
    if (filter === "all") return initialItems;
    if (filter === "awards") {
      return initialItems.filter(
        (item) =>
          item.caption?.toLowerCase().includes("award") ||
          item.caption?.toLowerCase().includes("honor") ||
          item.caption?.toLowerCase().includes("excellence")
      );
    }
    if (filter === "expos") {
      return initialItems.filter(
        (item) =>
          item.caption?.toLowerCase().includes("expo") ||
          item.caption?.toLowerCase().includes("showcase") ||
          item.caption?.toLowerCase().includes("forum")
      );
    }
    if (filter === "summits") {
      return initialItems.filter(
        (item) =>
          item.caption?.toLowerCase().includes("summit") ||
          item.caption?.toLowerCase().includes("kdra") ||
          item.caption?.toLowerCase().includes("partner")
      );
    }
    return initialItems;
  };

  const displayedItems = filterItems(selectedFilter);

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12 sm:mb-16">
          {[
            { id: "all", label: "All Achievements" },
            { id: "awards", label: "Awards & Recognitions" },
            { id: "summits", label: "KDRA & Leadership Summits" },
            { id: "expos", label: "Property Expos & Meets" },
          ].map((cat) => {
            const isSelected = selectedFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedFilter(cat.id as CategoryType)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-brand-600 text-white shadow-md shadow-brand-600/25 scale-[1.02]"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col"
            >
              {/* Image Container with 4:3 Aspect Ratio */}
              <div
                className="relative aspect-[4/3] w-full bg-gray-100 overflow-hidden cursor-pointer"
                onClick={() => setActiveModalItem(item)}
              >
                <Image
                  src={item.image_url}
                  alt={item.caption || "The PM Properties Achievement"}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full">
                    <Maximize2 className="w-3.5 h-3.5" />
                    Click to view full image
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100">
                      <Award className="w-3 h-3 text-brand-600" />
                      Milestone
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      Verified
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                    {item.caption || "Prestigious Industry Milestone & Leadership Forum"}
                  </h3>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    The PM Properties Showcase
                  </span>
                  <button
                    onClick={() => setActiveModalItem(item)}
                    className="text-brand-600 font-semibold hover:text-brand-700 transition-colors cursor-pointer"
                  >
                    View photo &rarr;
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {displayedItems.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No items found for this category.</p>
            <button
              onClick={() => setSelectedFilter("all")}
              className="mt-3 text-brand-600 font-semibold text-sm hover:underline"
            >
              Reset filter
            </button>
          </div>
        )}
      </div>

      {/* Lightbox / Modal for High-Res View */}
      <AnimatePresence>
        {activeModalItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveModalItem(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
            >
              <button
                type="button"
                onClick={() => setActiveModalItem(null)}
                aria-label="Close image modal"
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative w-full aspect-[16/10] bg-black">
                <Image
                  src={activeModalItem.image_url}
                  alt={activeModalItem.caption || "Achievement preview"}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              {activeModalItem.caption && (
                <div className="p-6 bg-white border-t border-gray-100 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg leading-tight">
                      {activeModalItem.caption}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">
                      Official Record &bull; The PM Properties Verified Portfolio
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
