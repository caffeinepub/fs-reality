import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { Building2, Check, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Bath, BedDouble, MapPin, Maximize2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ListingType, PropertyType } from "../backend.d";
import type { Property } from "../backend.d";
import PhotoUploader from "../components/PhotoUploader";
import VideoUploader from "../components/VideoUploader";
import {
  useDeleteProperty,
  useGetMyProperties,
  useUpdateProperty,
} from "../hooks/useQueries";
import {
  INDIAN_CITIES,
  INDIAN_STATES,
  LISTING_TYPE_LABELS,
  PROPERTY_TYPE_LABELS,
} from "../utils/constants";
import { formatArea, formatIndianPrice } from "../utils/formatters";
import { normalizePhotoUrls } from "../utils/normalizePhotoUrls";

const PROPERTY_IMAGES: Record<PropertyType, string> = {
  [PropertyType.apartment]:
    "/assets/generated/property-apartment.dim_800x500.jpg",
  [PropertyType.villa]: "/assets/generated/property-villa.dim_800x500.jpg",
  [PropertyType.commercial]:
    "/assets/generated/property-commercial.dim_800x500.jpg",
  [PropertyType.plot]: "/assets/generated/property-plot.dim_800x500.jpg",
};

interface EditFormData {
  title: string;
  description: string;
  price: string;
  location: string;
  city: string;
  state: string;
  propertyType: PropertyType;
  listingType: ListingType;
  bedrooms: string;
  bathrooms: string;
  areaSqFt: string;
  contactName: string;
  contactPhone: string;
  photoUrls: string[];
  videoUrls: string[];
}

export default function MyListingsPage() {
  const { data: properties, isLoading, isError } = useGetMyProperties();
  const { mutateAsync: deleteProperty, isPending: isDeleting } =
    useDeleteProperty();
  const { mutateAsync: updateProperty, isPending: isUpdating } =
    useUpdateProperty();

  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [editProperty, setEditProperty] = useState<Property | null>(null);
  const [editForm, setEditForm] = useState<EditFormData | null>(null);

  function openEdit(property: Property) {
    setEditProperty(property);
    setEditForm({
      title: property.title,
      description: property.description,
      price: Number(property.price).toString(),
      location: property.location,
      city: property.city,
      state: property.state,
      propertyType: property.propertyType,
      listingType: property.listingType,
      bedrooms: Number(property.bedrooms).toString(),
      bathrooms: Number(property.bathrooms).toString(),
      areaSqFt: Number(property.areaSqFt).toString(),
      contactName: property.contactName,
      contactPhone: property.contactPhone,
      photoUrls: normalizePhotoUrls(property.photoUrls),
      videoUrls: property.videoUrls ?? [],
    });
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteProperty(deleteId);
      toast.success("Property deleted successfully.");
    } catch {
      toast.error("Failed to delete property.");
    } finally {
      setDeleteId(null);
    }
  }

  async function handleUpdate() {
    if (!editProperty || !editForm) return;
    try {
      await updateProperty({
        id: editProperty.id,
        input: {
          title: editForm.title,
          description: editForm.description,
          price: BigInt(Math.round(Number(editForm.price))),
          location: editForm.location,
          city: editForm.city,
          state: editForm.state,
          propertyType: editForm.propertyType,
          listingType: editForm.listingType,
          bedrooms: BigInt(Number(editForm.bedrooms)),
          bathrooms: BigInt(Number(editForm.bathrooms)),
          areaSqFt: BigInt(Math.round(Number(editForm.areaSqFt))),
          contactName: editForm.contactName,
          contactPhone: editForm.contactPhone,
          photoUrls: editForm.photoUrls,
          videoUrls: editForm.videoUrls,
        },
      });
      toast.success("Property updated successfully.");
      setEditProperty(null);
      setEditForm(null);
    } catch {
      toast.error("Failed to update property.");
    }
  }

  function updateEditField<K extends keyof EditFormData>(
    field: K,
    value: EditFormData[K],
  ) {
    setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">
            My Listings
          </h1>
          <p className="text-muted-foreground mt-1">
            {isLoading
              ? "Loading..."
              : `${(properties || []).length} properties listed`}
          </p>
        </div>
        <Link to="/post">
          <Button className="bg-brand hover:bg-brand-dark text-white font-semibold gap-2 shadow-brand">
            <Plus className="w-4 h-4" />
            Post New
          </Button>
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          data-ocid="my_listings.loading_state"
        >
          {Array.from({ length: 3 }, (_, i) => `skeleton-${i}`).map((key) => (
            <div
              key={key}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-20" data-ocid="my_listings.error_state">
          <p className="text-destructive font-medium">
            Failed to load your listings.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      ) : !properties || properties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-card border border-border rounded-2xl"
          data-ocid="my_listings.empty_state"
        >
          <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-brand" />
          </div>
          <h3 className="font-heading font-bold text-xl text-foreground mb-2">
            No listings yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Post your first property to get started.
          </p>
          <Link to="/post">
            <Button className="bg-brand hover:bg-brand-dark text-white font-semibold gap-2">
              <Plus className="w-4 h-4" />
              Post Property
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {properties.map((property, i) => {
              const isBuy = property.listingType === ListingType.buy;
              const normalizedPhotos = normalizePhotoUrls(property.photoUrls);
              const image =
                normalizedPhotos.length > 0
                  ? normalizedPhotos[0]
                  : PROPERTY_IMAGES[property.propertyType];
              return (
                <motion.div
                  key={property.id.toString()}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-card rounded-xl border border-border overflow-hidden shadow-card"
                  data-ocid={`my_listings.item.${i + 1}`}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={image}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge
                        className={`text-xs font-semibold ${isBuy ? "bg-primary text-primary-foreground" : "bg-brand text-white"}`}
                      >
                        {LISTING_TYPE_LABELS[property.listingType]}
                      </Badge>
                    </div>
                    {!property.isActive && (
                      <Badge className="absolute top-3 right-3 bg-muted text-muted-foreground">
                        Inactive
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div>
                      <div className="price-badge text-xl font-extrabold text-foreground">
                        {formatIndianPrice(property.price)}
                      </div>
                      <h3 className="font-heading font-bold text-sm text-foreground line-clamp-2 mt-1">
                        {property.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 text-brand shrink-0" />
                      <span className="truncate">
                        {property.location}, {property.city}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {Number(property.bedrooms) > 0 && (
                        <span className="flex items-center gap-1">
                          <BedDouble className="w-3 h-3" />
                          {Number(property.bedrooms)} BHK
                        </span>
                      )}
                      {Number(property.bathrooms) > 0 && (
                        <span className="flex items-center gap-1">
                          <Bath className="w-3 h-3" />
                          {Number(property.bathrooms)}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Maximize2 className="w-3 h-3" />
                        {formatArea(property.areaSqFt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 border-brand text-brand hover:bg-brand/10"
                        onClick={() => openEdit(property)}
                        data-ocid={`my_listings.edit_button.${i + 1}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 gap-1.5 border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => setDeleteId(property.id)}
                        data-ocid={`my_listings.delete_button.${i + 1}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent data-ocid="my_listings.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property listing? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="my_listings.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="my_listings.confirm_button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Sheet */}
      <Sheet
        open={editProperty !== null}
        onOpenChange={(open) => !open && setEditProperty(null)}
      >
        <SheetContent
          side="right"
          className="w-full sm:max-w-lg overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle className="font-heading">Edit Property</SheetTitle>
          </SheetHeader>

          {editForm && (
            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => updateEditField("title", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={editForm.description}
                  onChange={(e) =>
                    updateEditField("description", e.target.value)
                  }
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Price (₹)</Label>
                  <Input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => updateEditField("price", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Area (sq.ft.)</Label>
                  <Input
                    type="number"
                    value={editForm.areaSqFt}
                    onChange={(e) =>
                      updateEditField("areaSqFt", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Listing Type</Label>
                  <Select
                    value={editForm.listingType}
                    onValueChange={(v) =>
                      updateEditField("listingType", v as ListingType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ListingType.buy}>For Sale</SelectItem>
                      <SelectItem value={ListingType.rent}>For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Property Type</Label>
                  <Select
                    value={editForm.propertyType}
                    onValueChange={(v) =>
                      updateEditField("propertyType", v as PropertyType)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PROPERTY_TYPE_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Bedrooms</Label>
                  <Select
                    value={editForm.bedrooms}
                    onValueChange={(v) => updateEditField("bedrooms", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["0", "1", "2", "3", "4", "5"].map((n) => (
                        <SelectItem key={n} value={n}>
                          {n === "0" ? "Studio/N/A" : `${n} BHK`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bathrooms</Label>
                  <Select
                    value={editForm.bathrooms}
                    onValueChange={(v) => updateEditField("bathrooms", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["0", "1", "2", "3", "4"].map((n) => (
                        <SelectItem key={n} value={n}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={editForm.location}
                  onChange={(e) => updateEditField("location", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Select
                    value={editForm.city}
                    onValueChange={(v) => {
                      updateEditField("city", v);
                      updateEditField("state", INDIAN_STATES[v] || "");
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input
                    value={editForm.state}
                    onChange={(e) => updateEditField("state", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    value={editForm.contactName}
                    onChange={(e) =>
                      updateEditField("contactName", e.target.value)
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Phone</Label>
                  <Input
                    type="tel"
                    value={editForm.contactPhone}
                    onChange={(e) =>
                      updateEditField("contactPhone", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Photo Management */}
              <div className="space-y-2">
                <Label className="font-semibold">
                  Property Photos
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    (optional)
                  </span>
                </Label>
                <PhotoUploader
                  key={editProperty?.id?.toString()}
                  initialUrls={editForm.photoUrls}
                  onChange={(urls) => updateEditField("photoUrls", urls)}
                  maxPhotos={10}
                  disabled={isUpdating}
                />
              </div>

              {/* Video Management */}
              <div className="space-y-2">
                <Label className="font-semibold">
                  Property Videos
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    (optional)
                  </span>
                </Label>
                <VideoUploader
                  key={`video-${editProperty?.id?.toString()}`}
                  initialUrls={editForm.videoUrls}
                  onChange={(urls) => updateEditField("videoUrls", urls)}
                  maxVideos={3}
                  disabled={isUpdating}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  className="flex-1 bg-brand hover:bg-brand-dark text-white font-semibold gap-2"
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  data-ocid="my_listings.save_button"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditProperty(null);
                    setEditForm(null);
                  }}
                  data-ocid="my_listings.close_button"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
