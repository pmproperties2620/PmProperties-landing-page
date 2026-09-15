"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Bed,
  Bath,
  Maximize,
  MapPin,
  Calendar,
  ArrowLeft,
  Check,
  Share2,
  ChevronLeft,
  ChevronRight,
  Building,
} from "lucide-react";
import { formatPrice, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import AnimatedSection from "@/components/ui/AnimatedSection";
import type { Property } from "@/data/properties";

const fallbackImage = "/images/property-1.jpg";

export default function PropertyClient({ property }: { property: Property }) {
  const [currentImage, setCurrentImage] = useState(0);

  const statusColor =
    property.status === "For Sale"
      ? "success"
      : property.status === "For Rent"
        ? "warning"
        : "default";

  const images = property.images.length > 0 ? property.images : [fallbackImage];

  return (
    <>
      <section className="pt-20 pb-4 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-brand-600 transition-colors mb-4 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Properties
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="pb-16 sm:pb-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-8">
              <AnimatedSection>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 group">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImage}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.3 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={images[currentImage]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 1024px) 100vw, 66vw"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImage((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="w-5 h-5 text-slate-900" />
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImage((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="w-5 h-5 text-slate-900" />
                      </button>
                    </>
                  )}

                  <div className="absolute top-4 left-4 flex gap-2">
                    {property.featured && <Badge variant="featured">Featured</Badge>}
                    <Badge variant={statusColor}>{property.status}</Badge>
                  </div>

                  <div className="absolute bottom-4 right-4 flex gap-1.5">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          idx === currentImage
                            ? "bg-white w-6"
                            : "bg-white/50 hover:bg-white/80"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>
                        {property.address}, {property.city}, {property.state} {property.zip}
                      </span>
                    </div>
                  </div>
                  <button className="shrink-0 w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors">
                    <Share2 className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.15}>
                <div className="flex items-center gap-4 sm:gap-6 flex-wrap p-5 sm:p-6 bg-slate-50 rounded-2xl">
                  {[
                    { icon: Building, label: "Type", value: property.type },
                    { icon: Bed, label: "Bedrooms", value: property.bedrooms },
                    { icon: Bath, label: "Bathrooms", value: property.bathrooms },
                    { icon: Maximize, label: "Square Feet", value: property.sqft.toLocaleString() },
                    { icon: Calendar, label: "Listed", value: formatDate(property.listingDate) },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-brand-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">{item.label}</p>
                        <p className="font-semibold text-slate-900 text-sm">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.2}>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-3">Description</h2>
                  <p className="text-slate-600 leading-relaxed">{property.description}</p>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.25}>
                <div>
                  <h2 className="text-xl font-semibold text-slate-900 mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.features.map((f, i) => (
                      <motion.div
                        key={f}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-slate-50"
                      >
                        <div className="w-6 h-6 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-brand-600" />
                        </div>
                        <span className="text-slate-700 text-sm">{f}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <AnimatedSection delay={0.2} direction="none">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm"
                  >
                    <p className="text-3xl font-bold text-brand-600 mb-1">
                      {formatPrice(property.price)}
                      {property.status === "For Rent" && (
                        <span className="text-base font-normal text-slate-500">/mo</span>
                      )}
                    </p>
                    <p className="text-sm text-slate-500 mb-6">Year Built: {property.yearBuilt}</p>

                    <div className="space-y-3 mb-6">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="primary" size="lg" href="https://wa.me/919029923246" target="_blank" rel="noopener noreferrer" className="w-full">
                          Schedule a Tour
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button variant="outline" size="lg" className="w-full">
                          Send Inquiry
                        </Button>
                      </motion.div>
                    </div>

                    <div className="border-t border-slate-200 pt-6">
                      <h4 className="font-semibold text-slate-900 mb-3">Listed by</h4>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-200 to-brand-400 flex items-center justify-center text-white font-bold text-lg">
                          {property.agent.name.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{property.agent.name}</p>
                          <p className="text-xs text-slate-600">{property.agent.email}</p>
                          <p className="text-xs text-slate-600">{property.agent.phone}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatedSection>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
