import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Bath, BedDouble, MapPin, Maximize2 } from "lucide-react";
import type { Property } from "../backend.d";
import { ListingType, PropertyType } from "../backend.d";
import { LISTING_TYPE_LABELS, PROPERTY_TYPE_LABELS } from "../utils/constants";
import { formatArea, formatIndianPrice } from "../utils/formatters";

interface PropertyCardProps {
  property:
    | Property
    | {
        id: number | bigint;
        title: string;
        price: number | bigint;
        location: string;
        city: string;
        state: string;
        propertyType: PropertyType;
        listingType: ListingType;
        bedrooms: number | bigint;
        bathrooms: number | bigint;
        areaSqFt: number | bigint;
        image?: string;
      };
  index?: number;
  className?: string;
  variant?: "grid" | "list";
}

const PROPERTY_IMAGES: Record<PropertyType, string> = {
  [PropertyType.apartment]:
    "/assets/generated/property-apartment.dim_800x500.jpg",
  [PropertyType.villa]: "/assets/generated/property-villa.dim_800x500.jpg",
  [PropertyType.commercial]:
    "/assets/generated/property-commercial.dim_800x500.jpg",
  [PropertyType.plot]: "/assets/generated/property-plot.dim_800x500.jpg",
};

export default function PropertyCard({
  property,
  index,
  className,
  variant = "grid",
}: PropertyCardProps) {
  const id = property.id;
  const bedrooms = Number(property.bedrooms);
  const bathrooms = Number(property.bathrooms);
  const image =
    ("image" in property && property.image) ||
    PROPERTY_IMAGES[property.propertyType];
  const isBuy = property.listingType === ListingType.buy;

  if (variant === "list") {
    return (
      <Link
        to="/property/$id"
        params={{ id: id.toString() }}
        data-ocid={index !== undefined ? `listings.item.${index}` : undefined}
        className={cn(
          "flex gap-4 bg-card rounded-xl border border-border p-3 property-card-hover group cursor-pointer block",
          className,
        )}
      >
        {/* Image */}
        <div className="relative w-40 sm:w-52 h-32 sm:h-36 rounded-lg overflow-hidden shrink-0">
          <img
            src={image}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge
            className={cn(
              "absolute top-2 left-2 text-xs font-semibold",
              isBuy
                ? "bg-primary text-primary-foreground"
                : "bg-brand text-white",
            )}
          >
            {LISTING_TYPE_LABELS[property.listingType]}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-1 space-y-2">
          <div>
            <h3 className="font-heading font-bold text-base text-foreground line-clamp-1 group-hover:text-brand transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-xs mt-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>
                {property.location}, {property.city}, {property.state}
              </span>
            </div>
          </div>

          <div className="price-badge text-xl font-extrabold text-foreground">
            {formatIndianPrice(property.price)}
            {property.listingType === ListingType.rent && (
              <span className="text-xs font-normal text-muted-foreground ml-1">
                /mo
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {bedrooms > 0 && (
              <span className="flex items-center gap-1">
                <BedDouble className="w-3.5 h-3.5" />
                {bedrooms} BHK
              </span>
            )}
            {bathrooms > 0 && (
              <span className="flex items-center gap-1">
                <Bath className="w-3.5 h-3.5" />
                {bathrooms}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />
              {formatArea(property.areaSqFt)}
            </span>
            <Badge variant="outline" className="text-xs ml-auto">
              {PROPERTY_TYPE_LABELS[property.propertyType]}
            </Badge>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      to="/property/$id"
      params={{ id: id.toString() }}
      data-ocid={index !== undefined ? `listings.item.${index}` : undefined}
      className={cn(
        "bg-card rounded-xl border border-border overflow-hidden property-card-hover group cursor-pointer block",
        className,
      )}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge
            className={cn(
              "text-xs font-semibold",
              isBuy
                ? "bg-primary text-primary-foreground"
                : "bg-brand text-white",
            )}
          >
            {LISTING_TYPE_LABELS[property.listingType]}
          </Badge>
          <Badge
            variant="secondary"
            className="text-xs bg-white/90 text-foreground"
          >
            {PROPERTY_TYPE_LABELS[property.propertyType]}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div className="price-badge text-2xl font-extrabold text-foreground leading-tight">
          {formatIndianPrice(property.price)}
          {property.listingType === ListingType.rent && (
            <span className="text-sm font-normal text-muted-foreground ml-1">
              /month
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-base text-foreground line-clamp-2 leading-snug group-hover:text-brand transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <MapPin className="w-3.5 h-3.5 shrink-0 text-brand" />
          <span className="truncate">
            {property.location}, {property.city}
          </span>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-1 border-t border-border">
          {bedrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4" />
              <span>{bedrooms} BHK</span>
            </span>
          )}
          {bathrooms > 0 && (
            <span className="flex items-center gap-1.5">
              <Bath className="w-4 h-4" />
              <span>{bathrooms}</span>
            </span>
          )}
          <span className="flex items-center gap-1.5 ml-auto">
            <Maximize2 className="w-4 h-4" />
            <span>{formatArea(property.areaSqFt)}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
