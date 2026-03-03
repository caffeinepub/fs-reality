import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useParams, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  Calendar,
  MapPin,
  Maximize2,
  Phone,
  Share2,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ListingType, PropertyType } from "../backend.d";
import { useGetProperty } from "../hooks/useQueries";
import {
  LISTING_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
  SAMPLE_PROPERTIES,
} from "../utils/constants";
import {
  formatArea,
  formatDate,
  formatFullPrice,
  formatIndianPrice,
} from "../utils/formatters";

const PROPERTY_IMAGES: Record<PropertyType, string> = {
  [PropertyType.apartment]:
    "/assets/generated/property-apartment.dim_800x500.jpg",
  [PropertyType.villa]: "/assets/generated/property-villa.dim_800x500.jpg",
  [PropertyType.commercial]:
    "/assets/generated/property-commercial.dim_800x500.jpg",
  [PropertyType.plot]: "/assets/generated/property-plot.dim_800x500.jpg",
};

export default function PropertyDetailPage() {
  const params = useParams({ from: "/property/$id" });
  const router = useRouter();
  const id = BigInt(params.id);

  const { data: property, isLoading, isError } = useGetProperty(id);

  // Fallback to sample data if id matches
  const sampleProperty = SAMPLE_PROPERTIES.find(
    (p) => p.id === Number(params.id),
  );
  const displayProperty = property || sampleProperty;

  if (isLoading && !sampleProperty) {
    return (
      <div
        className="container mx-auto px-4 py-8 max-w-5xl"
        data-ocid="property.loading_state"
      >
        <Skeleton className="h-8 w-24 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-2xl mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-24 w-full" />
          </div>
          <div>
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError && !sampleProperty) {
    return (
      <div
        className="container mx-auto px-4 py-8 text-center"
        data-ocid="property.error_state"
      >
        <p className="text-destructive font-medium text-lg">
          Property not found.
        </p>
        <Button
          onClick={() => router.navigate({ to: "/listings" } as never)}
          variant="outline"
          className="mt-4"
        >
          Back to Listings
        </Button>
      </div>
    );
  }

  if (!displayProperty) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-muted-foreground text-lg">Property not found.</p>
        <Button
          onClick={() => router.navigate({ to: "/listings" } as never)}
          variant="outline"
          className="mt-4"
        >
          Back to Listings
        </Button>
      </div>
    );
  }

  const bedrooms = Number(displayProperty.bedrooms);
  const bathrooms = Number(displayProperty.bathrooms);
  const isBuy = displayProperty.listingType === ListingType.buy;
  const image =
    ("image" in displayProperty && displayProperty.image) ||
    PROPERTY_IMAGES[displayProperty.propertyType];
  const postedAt =
    "postedAt" in displayProperty ? displayProperty.postedAt : null;

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard!");
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.history.back()}
        data-ocid="property.back_button"
        className="mb-6 gap-2 -ml-2 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Listings
      </Button>

      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative h-64 sm:h-80 md:h-[420px] rounded-2xl overflow-hidden mb-8 shadow-card"
      >
        <img
          src={image}
          alt={displayProperty.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge
            className={`text-sm font-semibold px-3 py-1 ${
              isBuy
                ? "bg-primary text-primary-foreground"
                : "bg-brand text-white"
            }`}
          >
            {LISTING_TYPE_LABELS[displayProperty.listingType]}
          </Badge>
          <Badge className="text-sm bg-white/90 text-foreground font-semibold px-3 py-1">
            {PROPERTY_TYPE_LABELS[displayProperty.propertyType]}
          </Badge>
        </div>

        {/* Share button */}
        <button
          type="button"
          onClick={handleShare}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2.5 rounded-xl hover:bg-white transition-colors"
          title="Share property"
        >
          <Share2 className="w-4 h-4 text-foreground" />
        </button>

        {/* Price overlay */}
        <div className="absolute bottom-4 left-4">
          <div className="price-badge text-3xl font-extrabold text-white drop-shadow-lg">
            {formatIndianPrice(displayProperty.price)}
            {displayProperty.listingType === ListingType.rent && (
              <span className="text-base font-normal text-white/80 ml-1">
                /month
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Details */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 space-y-6"
        >
          {/* Title & Location */}
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground leading-tight mb-2">
              {displayProperty.title}
            </h1>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="w-4 h-4 text-brand shrink-0" />
              <span>
                {displayProperty.location}, {displayProperty.city},{" "}
                {displayProperty.state}
              </span>
            </div>
            {postedAt && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Posted on {formatDate(postedAt as bigint)}</span>
              </div>
            )}
          </div>

          <Separator />

          {/* Specs Table */}
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground mb-4">
              Property Details
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {bedrooms > 0 && (
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <BedDouble className="w-6 h-6 text-brand mx-auto mb-2" />
                  <div className="font-heading font-bold text-foreground">
                    {bedrooms} BHK
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Bedrooms
                  </div>
                </div>
              )}
              {bathrooms > 0 && (
                <div className="bg-secondary rounded-xl p-4 text-center">
                  <Bath className="w-6 h-6 text-brand mx-auto mb-2" />
                  <div className="font-heading font-bold text-foreground">
                    {bathrooms}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Bathrooms
                  </div>
                </div>
              )}
              <div className="bg-secondary rounded-xl p-4 text-center">
                <Maximize2 className="w-6 h-6 text-brand mx-auto mb-2" />
                <div className="font-heading font-bold text-foreground">
                  {formatArea(displayProperty.areaSqFt)}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Total Area
                </div>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <Building2 className="w-6 h-6 text-brand mx-auto mb-2" />
                <div className="font-heading font-bold text-foreground">
                  {PROPERTY_TYPE_LABELS[displayProperty.propertyType]}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Property Type
                </div>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <MapPin className="w-6 h-6 text-brand mx-auto mb-2" />
                <div className="font-heading font-bold text-foreground">
                  {displayProperty.city}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">City</div>
              </div>
              <div className="bg-secondary rounded-xl p-4 text-center">
                <MapPin className="w-6 h-6 text-brand mx-auto mb-2" />
                <div className="font-heading font-bold text-foreground">
                  {displayProperty.state}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  State
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h2 className="font-heading font-bold text-lg text-foreground mb-3">
              About this Property
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {displayProperty.description}
            </p>
          </div>

          {/* Full Price */}
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-4">
            <div className="text-sm text-muted-foreground mb-1">
              Total Price
            </div>
            <div className="price-badge text-2xl font-extrabold text-foreground">
              {formatFullPrice(displayProperty.price)}
              {displayProperty.listingType === ListingType.rent && (
                <span className="text-base font-normal text-muted-foreground ml-1">
                  /month
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div
            className="bg-card border border-border rounded-2xl p-6 sticky top-24 shadow-card"
            data-ocid="property.contact_card"
          >
            <h3 className="font-heading font-bold text-base text-foreground mb-4">
              Contact Owner
            </h3>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                <User className="w-6 h-6 text-brand" />
              </div>
              <div>
                <div className="font-semibold text-foreground">
                  {displayProperty.contactName}
                </div>
                <div className="text-sm text-muted-foreground">
                  Property Owner
                </div>
              </div>
            </div>

            <a
              href={`tel:${displayProperty.contactPhone}`}
              className="flex items-center gap-3 bg-brand text-white rounded-xl px-4 py-3.5 font-semibold hover:bg-brand-dark transition-colors w-full"
            >
              <Phone className="w-4 h-4" />
              <span>{displayProperty.contactPhone}</span>
            </a>

            <p className="text-xs text-muted-foreground text-center mt-4 leading-relaxed">
              Mention FS Realty when contacting for better response.
            </p>

            <Separator className="my-4" />

            <div className="text-center">
              <div className="text-sm text-muted-foreground mb-1">
                Listed Price
              </div>
              <div className="price-badge text-2xl font-extrabold text-brand">
                {formatIndianPrice(displayProperty.price)}
              </div>
              {displayProperty.listingType === ListingType.rent && (
                <div className="text-xs text-muted-foreground">/month</div>
              )}
            </div>
          </div>

          {/* Similar Properties Link */}
          <Link to="/listings">
            <Button
              variant="outline"
              className="w-full border-brand text-brand hover:bg-brand/5"
            >
              Browse Similar Properties
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
