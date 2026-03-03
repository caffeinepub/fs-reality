import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { ListingType, type PropertyType } from "../backend.d";
import PropertyCard from "../components/PropertyCard";
import { type PropertyFilters, useGetProperties } from "../hooks/useQueries";
import {
  INDIAN_CITIES,
  PROPERTY_TYPE_LABELS,
  SAMPLE_PROPERTIES,
} from "../utils/constants";
import { formatIndianPrice } from "../utils/formatters";

const MAX_PRICE = 100_000_000; // 10 Cr

// Parse from URL params
function parseUrlParams() {
  const url = new URL(window.location.href);
  return {
    city: url.searchParams.get("city") || "",
    type: url.searchParams.get("type") || "",
    propertyType: url.searchParams.get("propertyType") || "",
  };
}

export default function ListingsPage() {
  const initialParams = parseUrlParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedCity, setSelectedCity] = useState(initialParams.city);
  const [selectedListingType, setSelectedListingType] = useState(
    initialParams.type,
  );
  const [selectedPropertyType, setSelectedPropertyType] = useState(
    initialParams.propertyType,
  );
  const [priceRange, setPriceRange] = useState<[number, number]>([
    0,
    MAX_PRICE,
  ]);
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Build filters for query
  const filters: PropertyFilters = {
    city: selectedCity || null,
    listingType: selectedListingType
      ? selectedListingType === "buy"
        ? ListingType.buy
        : ListingType.rent
      : null,
    propertyType: selectedPropertyType
      ? (selectedPropertyType as PropertyType)
      : null,
    minPrice: priceRange[0] > 0 ? BigInt(priceRange[0]) : null,
    maxPrice: priceRange[1] < MAX_PRICE ? BigInt(priceRange[1]) : null,
    minBedrooms: selectedBedrooms ? BigInt(selectedBedrooms) : null,
    maxBedrooms: selectedBedrooms ? BigInt(selectedBedrooms) : null,
  };

  const { data: properties, isLoading, isError } = useGetProperties(filters);

  // Combine backend + sample data when loading or backend returns empty
  const displayProperties = isLoading
    ? []
    : properties && properties.length > 0
      ? properties
      : filteredSampleProperties();

  function filteredSampleProperties() {
    return SAMPLE_PROPERTIES.filter((p) => {
      if (selectedCity && p.city.toLowerCase() !== selectedCity.toLowerCase())
        return false;
      if (selectedListingType === "buy" && p.listingType !== ListingType.buy)
        return false;
      if (selectedListingType === "rent" && p.listingType !== ListingType.rent)
        return false;
      if (selectedPropertyType && p.propertyType !== selectedPropertyType)
        return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (selectedBedrooms && p.bedrooms !== Number(selectedBedrooms))
        return false;
      return true;
    });
  }

  function clearFilters() {
    setSelectedCity("");
    setSelectedListingType("");
    setSelectedPropertyType("");
    setPriceRange([0, MAX_PRICE]);
    setSelectedBedrooms("");
  }

  const hasActiveFilters =
    selectedCity ||
    selectedListingType ||
    selectedPropertyType ||
    selectedBedrooms ||
    priceRange[0] > 0 ||
    priceRange[1] < MAX_PRICE;

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-heading font-bold text-base">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-brand hover:text-brand gap-1 h-auto py-1"
          >
            <X className="w-3 h-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Listing Type */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Property For</p>
        <Select
          value={selectedListingType || "all"}
          onValueChange={(v) => setSelectedListingType(v === "all" ? "" : v)}
        >
          <SelectTrigger data-ocid="listings.filter_listing_type.select">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="buy">Buy</SelectItem>
            <SelectItem value="rent">Rent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">City</p>
        <Select
          value={selectedCity || "all"}
          onValueChange={(v) => setSelectedCity(v === "all" ? "" : v)}
        >
          <SelectTrigger data-ocid="listings.filter_city.select">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {INDIAN_CITIES.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Property Type</p>
        <Select
          value={selectedPropertyType || "all"}
          onValueChange={(v) => setSelectedPropertyType(v === "all" ? "" : v)}
        >
          <SelectTrigger data-ocid="listings.filter_type.select">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-foreground">Bedrooms</p>
        <div className="flex flex-wrap gap-2">
          {["", "1", "2", "3", "4", "5"].map((b) => (
            <button
              type="button"
              key={b}
              onClick={() => setSelectedBedrooms(b)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                selectedBedrooms === b
                  ? "bg-brand text-white border-brand"
                  : "bg-card text-foreground border-border hover:border-brand"
              }`}
            >
              {b === "" ? "Any" : b === "5" ? "5+" : `${b} BHK`}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-foreground">Price Range</p>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={500_000}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>
            {priceRange[0] > 0 ? formatIndianPrice(priceRange[0]) : "No min"}
          </span>
          <span>
            {priceRange[1] < MAX_PRICE
              ? formatIndianPrice(priceRange[1])
              : "No max"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">
            {selectedCity ? `Properties in ${selectedCity}` : "All Properties"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isLoading
              ? "Loading..."
              : `${displayProperties.length} properties found`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile filter toggle */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="md:hidden gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <Badge className="bg-brand text-white text-xs ml-1 h-5 px-1.5">
                    !
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filter Properties</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>

          {/* View mode */}
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button
              type="button"
              data-ocid="listings.view_grid.toggle"
              onClick={() => setViewMode("grid")}
              className={`p-2 transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              data-ocid="listings.view_list.toggle"
              onClick={() => setViewMode("list")}
              className={`p-2 transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Active filter chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mb-5">
          {selectedCity && (
            <Badge variant="outline" className="gap-1 border-brand text-brand">
              {selectedCity}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setSelectedCity("")}
              />
            </Badge>
          )}
          {selectedListingType && (
            <Badge variant="outline" className="gap-1 border-brand text-brand">
              {selectedListingType === "buy" ? "For Sale" : "For Rent"}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setSelectedListingType("")}
              />
            </Badge>
          )}
          {selectedPropertyType && (
            <Badge variant="outline" className="gap-1 border-brand text-brand">
              {PROPERTY_TYPE_LABELS[selectedPropertyType as PropertyType]}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setSelectedPropertyType("")}
              />
            </Badge>
          )}
          {selectedBedrooms && (
            <Badge variant="outline" className="gap-1 border-brand text-brand">
              {selectedBedrooms} BHK
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => setSelectedBedrooms("")}
              />
            </Badge>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 shrink-0">
          <div className="bg-card border border-border rounded-xl p-5 sticky top-24">
            <FilterSidebar />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
              data-ocid="listings.loading_state"
            >
              {Array.from({ length: 6 }, (_, i) => `skeleton-${i}`).map(
                (key) => (
                  <div
                    key={key}
                    className="bg-card rounded-xl border border-border overflow-hidden"
                  >
                    <Skeleton className="h-48 w-full" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-7 w-36" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                ),
              )}
            </div>
          ) : isError ? (
            <div className="text-center py-20" data-ocid="listings.error_state">
              <p className="text-destructive font-medium">
                Failed to load properties. Please try again.
              </p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="mt-4"
              >
                Retry
              </Button>
            </div>
          ) : displayProperties.length === 0 ? (
            <div
              className="text-center py-20 bg-card border border-border rounded-xl"
              data-ocid="listings.empty_state"
            >
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">
                No properties found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your filters or search in a different city.
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-brand text-brand"
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {displayProperties.map((property, i) => (
                <motion.div
                  key={property.id.toString()}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <PropertyCard
                    property={property}
                    index={i + 1}
                    variant={viewMode}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
