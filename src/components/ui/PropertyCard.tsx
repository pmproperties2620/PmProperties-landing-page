import Link from "next/link";
import Image from "next/image";
import { Bath, Bed, Maximize, MapPin } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Badge from "./Badge";
import type { Property } from "@/data/properties";

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const statusColor =
    property.status === "For Sale"
      ? "success"
      : property.status === "For Rent"
        ? "warning"
        : "default";

  return (
    <Link
      href={`/properties/${property.id}`}
      className="group block rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {property.featured && (
          <Badge variant="featured" className="absolute top-3 left-3 z-20">
            Featured
          </Badge>
        )}
        <Badge
          variant={statusColor}
          className="absolute top-3 right-3 z-20"
        >
          {property.status}
        </Badge>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent z-10" />
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/10 transition-colors duration-500 z-10" />
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-body font-normal leading-[1.6] mb-2">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {property.city}, {property.state}
          </span>
        </div>
        <h3 className="font-heading text-lg lg:text-xl font-bold leading-tight tracking-[-0.02em] text-slate-900 group-hover:text-brand-600 transition-colors duration-300 mb-1">
          {property.title}
        </h3>
        <p className="font-heading text-2xl lg:text-3xl font-black leading-tight tracking-[-0.02em] text-brand-600 mb-4">
          {formatPrice(property.price)}
          {property.status === "For Rent" && (
            <span className="text-xs sm:text-sm font-normal font-body text-slate-500">/mo</span>
          )}
        </p>
        <div className="flex items-center gap-4 text-xs sm:text-sm font-body font-normal leading-[1.6] text-slate-600 pt-4 border-t border-slate-100">
          <span className="flex items-center gap-1.5">
            <Bed className="w-4 h-4 text-slate-400" />
            <span className="font-heading font-semibold">{property.bedrooms}</span> Beds
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="w-4 h-4 text-slate-400" />
            <span className="font-heading font-semibold">{property.bathrooms}</span> Baths
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="w-4 h-4 text-slate-400" />
            <span className="font-heading font-semibold">{property.sqft.toLocaleString()}</span> sqft
          </span>
        </div>
      </div>
    </Link>
  );
}
