import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@tanstack/react-router";
import { Building2, Check, IndianRupee, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ListingType, type PropertyType } from "../backend.d";
import PhotoUploader from "../components/PhotoUploader";
import { useCreateProperty } from "../hooks/useQueries";
import {
  INDIAN_CITIES,
  INDIAN_STATES,
  PROPERTY_TYPE_LABELS,
} from "../utils/constants";

interface FormData {
  title: string;
  description: string;
  price: string;
  location: string;
  city: string;
  state: string;
  propertyType: PropertyType | "";
  listingType: ListingType | "";
  bedrooms: string;
  bathrooms: string;
  areaSqFt: string;
  contactName: string;
  contactPhone: string;
  photoUrls: string[];
}

interface FormErrors {
  [key: string]: string;
}

export default function PostPropertyPage() {
  const router = useRouter();
  const { mutateAsync: createProperty, isPending } = useCreateProperty();

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    location: "",
    city: "",
    state: "",
    propertyType: "",
    listingType: "",
    bedrooms: "0",
    bathrooms: "0",
    areaSqFt: "",
    contactName: "",
    contactPhone: "",
    photoUrls: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function updateField<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleCityChange(city: string) {
    updateField("city", city);
    const state = INDIAN_STATES[city] || "";
    updateField("state", state);
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (form.title.length > 0 && form.title.length < 5)
      newErrors.title = "Title must be at least 5 characters";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (
      !form.price ||
      Number.isNaN(Number(form.price)) ||
      Number(form.price) <= 0
    )
      newErrors.price = "Valid price is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state.trim()) newErrors.state = "State is required";
    if (!form.propertyType)
      newErrors.propertyType = "Property type is required";
    if (!form.listingType) newErrors.listingType = "Listing type is required";
    if (
      !form.areaSqFt ||
      Number.isNaN(Number(form.areaSqFt)) ||
      Number(form.areaSqFt) <= 0
    )
      newErrors.areaSqFt = "Valid area is required";
    if (!form.contactName.trim())
      newErrors.contactName = "Contact name is required";
    if (!form.contactPhone.trim())
      newErrors.contactPhone = "Contact phone is required";
    if (
      form.contactPhone &&
      !/^(\+91|0)?[6-9]\d{9}$/.test(form.contactPhone.replace(/\s/g, ""))
    ) {
      newErrors.contactPhone = "Enter a valid Indian phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    try {
      const id = await createProperty({
        title: form.title,
        description: form.description,
        price: BigInt(Math.round(Number(form.price))),
        location: form.location,
        city: form.city,
        state: form.state,
        propertyType: form.propertyType as PropertyType,
        listingType: form.listingType as ListingType,
        bedrooms: BigInt(Number(form.bedrooms)),
        bathrooms: BigInt(Number(form.bathrooms)),
        areaSqFt: BigInt(Math.round(Number(form.areaSqFt))),
        contactName: form.contactName,
        contactPhone: form.contactPhone,
        photoUrls: form.photoUrls,
      });
      setSubmitted(true);
      toast.success("Property listed successfully!");
      setTimeout(() => {
        router.navigate({ to: `/property/${id}` } as never);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Failed to post property. Please try again.");
    }
  }

  if (submitted) {
    return (
      <div
        className="container mx-auto px-4 py-20 max-w-md text-center"
        data-ocid="post.success_state"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="space-y-6"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-foreground">
            Property Listed!
          </h2>
          <p className="text-muted-foreground">
            Your property has been posted successfully. Redirecting...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-brand" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">
            Post Your Property
          </h1>
        </div>
        <p className="text-muted-foreground ml-[3.25rem]">
          Fill in the details below to list your property on FS Realty.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-8">
          {/* Basic Info */}
          <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <Badge className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center p-0 text-xs">
                1
              </Badge>
              Basic Information
            </h2>

            <div className="space-y-2">
              <Label htmlFor="title">Property Title *</Label>
              <Input
                id="title"
                data-ocid="post.title.input"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="e.g. Spacious 3BHK in Bandra West"
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p
                  className="text-destructive text-sm"
                  data-ocid="post.title.error_state"
                >
                  {errors.title}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Describe your property in detail..."
                className={`min-h-[120px] resize-none ${errors.description ? "border-destructive" : ""}`}
              />
              {errors.description && (
                <p className="text-destructive text-sm">{errors.description}</p>
              )}
            </div>

            {/* Listing Type */}
            <div className="space-y-2">
              <Label>Listing For *</Label>
              <RadioGroup
                value={form.listingType}
                onValueChange={(v) =>
                  updateField("listingType", v as ListingType)
                }
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value={ListingType.buy}
                    id="buy"
                    data-ocid="post.listing_type.radio"
                  />
                  <Label htmlFor="buy" className="cursor-pointer font-medium">
                    Sale (Buy)
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value={ListingType.rent}
                    id="rent"
                    data-ocid="post.listing_type.radio"
                  />
                  <Label htmlFor="rent" className="cursor-pointer font-medium">
                    Rent
                  </Label>
                </div>
              </RadioGroup>
              {errors.listingType && (
                <p className="text-destructive text-sm">{errors.listingType}</p>
              )}
            </div>
          </section>

          {/* Property Details */}
          <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <Badge className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center p-0 text-xs">
                2
              </Badge>
              Property Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Property Type */}
              <div className="space-y-2">
                <Label>Property Type *</Label>
                <Select
                  value={form.propertyType}
                  onValueChange={(v) =>
                    updateField("propertyType", v as PropertyType)
                  }
                >
                  <SelectTrigger
                    className={errors.propertyType ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select type" />
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
                {errors.propertyType && (
                  <p className="text-destructive text-sm">
                    {errors.propertyType}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="price"
                    data-ocid="post.price.input"
                    type="number"
                    value={form.price}
                    onChange={(e) => updateField("price", e.target.value)}
                    placeholder="e.g. 8500000"
                    className={`pl-9 ${errors.price ? "border-destructive" : ""}`}
                    min="0"
                  />
                </div>
                {errors.price && (
                  <p
                    className="text-destructive text-sm"
                    data-ocid="post.price.error_state"
                  >
                    {errors.price}
                  </p>
                )}
              </div>

              {/* Area */}
              <div className="space-y-2">
                <Label htmlFor="area">Area (sq. ft.) *</Label>
                <Input
                  id="area"
                  type="number"
                  value={form.areaSqFt}
                  onChange={(e) => updateField("areaSqFt", e.target.value)}
                  placeholder="e.g. 1200"
                  className={errors.areaSqFt ? "border-destructive" : ""}
                  min="0"
                />
                {errors.areaSqFt && (
                  <p className="text-destructive text-sm">{errors.areaSqFt}</p>
                )}
              </div>

              {/* Bedrooms */}
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms (BHK)</Label>
                <Select
                  value={form.bedrooms}
                  onValueChange={(v) => updateField("bedrooms", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select BHK" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Studio / N/A</SelectItem>
                    <SelectItem value="1">1 BHK</SelectItem>
                    <SelectItem value="2">2 BHK</SelectItem>
                    <SelectItem value="3">3 BHK</SelectItem>
                    <SelectItem value="4">4 BHK</SelectItem>
                    <SelectItem value="5">5+ BHK</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Select
                  value={form.bathrooms}
                  onValueChange={(v) => updateField("bathrooms", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select bathrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <Badge className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center p-0 text-xs">
                3
              </Badge>
              Location Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Location */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="location">Locality / Area *</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g. Bandra West, Koramangala"
                  className={errors.location ? "border-destructive" : ""}
                />
                {errors.location && (
                  <p className="text-destructive text-sm">{errors.location}</p>
                )}
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label>City *</Label>
                <Select value={form.city} onValueChange={handleCityChange}>
                  <SelectTrigger
                    data-ocid="post.city.select"
                    className={errors.city ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.city && (
                  <p className="text-destructive text-sm">{errors.city}</p>
                )}
              </div>

              {/* State */}
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={form.state}
                  onChange={(e) => updateField("state", e.target.value)}
                  placeholder="e.g. Maharashtra"
                  className={errors.state ? "border-destructive" : ""}
                />
                {errors.state && (
                  <p className="text-destructive text-sm">{errors.state}</p>
                )}
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <Badge className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center p-0 text-xs">
                4
              </Badge>
              Contact Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="contactName">Your Name *</Label>
                <Input
                  id="contactName"
                  value={form.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  placeholder="Full name"
                  className={errors.contactName ? "border-destructive" : ""}
                />
                {errors.contactName && (
                  <p className="text-destructive text-sm">
                    {errors.contactName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone Number *</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className={errors.contactPhone ? "border-destructive" : ""}
                />
                {errors.contactPhone && (
                  <p
                    className="text-destructive text-sm"
                    data-ocid="post.phone.error_state"
                  >
                    {errors.contactPhone}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Photos */}
          <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <Badge className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center p-0 text-xs">
                5
              </Badge>
              Property Photos
              <span className="text-xs font-normal text-muted-foreground ml-1">
                (optional)
              </span>
            </h2>
            <PhotoUploader
              initialUrls={[]}
              onChange={(urls) => updateField("photoUrls", urls)}
              maxPhotos={10}
              disabled={isPending}
            />
          </section>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              data-ocid="post.submit_button"
              disabled={isPending}
              className="flex-1 bg-brand hover:bg-brand-dark text-white font-semibold h-12 text-base shadow-brand gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting Property...
                </>
              ) : (
                "Post Property"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.history.back()}
              className="sm:w-32"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
