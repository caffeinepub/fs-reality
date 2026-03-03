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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "@tanstack/react-router";
import {
  Building2,
  Check,
  CreditCard,
  Gift,
  IndianRupee,
  Loader2,
  SkipForward,
  Sparkles,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ListingType, type PropertyType } from "../backend.d";
import PhotoUploader from "../components/PhotoUploader";
import VideoUploader from "../components/VideoUploader";
import { useCreateCheckoutSession } from "../hooks/useCheckout";
import { useFreeTrial } from "../hooks/useFreeTrial";
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
  videoUrls: string[];
}

interface FormErrors {
  [key: string]: string;
}

export default function PostPropertyPage() {
  const router = useRouter();
  const { mutateAsync: createProperty, isPending } = useCreateProperty();
  const { mutateAsync: createCheckoutSession, isPending: isCheckoutPending } =
    useCreateCheckoutSession();
  const { isTrialActive, daysRemaining, hoursRemaining } = useFreeTrial();

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
    videoUrls: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [createdPropertyId, setCreatedPropertyId] = useState<bigint | null>(
    null,
  );
  const [showPayment, setShowPayment] = useState(false);
  const [trialBannerDismissed, setTrialBannerDismissed] = useState(false);

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
        videoUrls: form.videoUrls,
      });
      setCreatedPropertyId(id);
      if (isTrialActive) {
        toast.success("Property published free during your trial!");
        router.navigate({ to: `/property/${id}` } as never);
        return;
      }
      setShowPayment(true);
      toast.success("Property saved! Complete payment to publish.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post property. Please try again.");
    }
  }

  async function handlePayNow() {
    try {
      const session = await createCheckoutSession({
        items: [
          {
            productName: "Property Listing Fee",
            currency: "inr",
            quantity: 1n,
            priceInCents: 99900n,
            productDescription: "FS Realty - Publish your property listing",
          },
        ],
        successUrl: `${window.location.origin}/payment-success`,
        cancelUrl: `${window.location.origin}/payment-cancelled`,
      });
      window.location.href = session.url;
    } catch (err) {
      console.error(err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Payment failed. Please try again.",
      );
    }
  }

  function handleSkipPayment() {
    if (createdPropertyId !== null) {
      router.navigate({ to: `/property/${createdPropertyId}` } as never);
    }
  }

  if (showPayment && createdPropertyId !== null) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-6"
          data-ocid="post.success_state"
        >
          {/* Success step indicator */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Property saved
            </span>
            <div className="w-8 h-0.5 bg-border" />
            {isTrialActive ? (
              <>
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center ring-2 ring-emerald-500">
                  <Gift className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Publish free
                </span>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center ring-2 ring-brand">
                  <CreditCard className="w-5 h-5 text-brand" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Pay to publish
                </span>
              </>
            )}
          </div>

          {isTrialActive ? (
            /* Free Trial Card */
            <div
              className="bg-card border-2 border-emerald-400 rounded-2xl overflow-hidden shadow-lg"
              data-ocid="payment.free_trial_card"
            >
              {/* Trial Banner */}
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-5 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 80% 50%, white 0%, transparent 55%)",
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-white font-heading font-extrabold text-2xl tracking-tight">
                        Free Trial Active
                      </span>
                      <span className="bg-white/25 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-white/30">
                        Limited Time Offer
                      </span>
                    </div>
                    <p className="text-white/85 text-sm font-medium">
                      {daysRemaining > 0
                        ? `${daysRemaining}d ${hoursRemaining}h remaining in your free trial`
                        : `${hoursRemaining}h remaining in your free trial`}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <h2 className="font-heading text-xl font-extrabold text-foreground mb-1">
                    Publish Your Property — It's Free!
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    You're in your 3-day free trial period. Publish your
                    property listing right now at no cost.
                  </p>
                </div>

                <Separator />

                <ul className="space-y-2">
                  {[
                    "Listing live for 90 days",
                    "Visible to thousands of buyers & renters",
                    "Direct contact from interested parties",
                    "Featured on search results",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-emerald-600" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <Separator />

                <Button
                  data-ocid="payment.publish_free_button"
                  onClick={handleSkipPayment}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold h-12 text-base gap-2 shadow-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  Publish for Free
                </Button>
              </div>
            </div>
          ) : (
            /* Standard Payment Card */
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
              {/* Banner */}
              <div className="bg-brand px-6 py-5 relative overflow-hidden">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 70% 50%, white 0%, transparent 60%)",
                  }}
                />
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">
                      Listing Fee
                    </p>
                    <p className="text-white font-heading font-extrabold text-3xl tracking-tight">
                      ₹999
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-5 space-y-4">
                <div>
                  <h2 className="font-heading text-xl font-extrabold text-foreground mb-1">
                    Pay to Publish Your Property
                  </h2>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Your property details have been saved. Complete the one-time
                    listing fee to make it live and visible to potential buyers
                    and renters.
                  </p>
                </div>

                <Separator />

                {/* What you get */}
                <ul className="space-y-2">
                  {[
                    "Listing live for 90 days",
                    "Visible to thousands of buyers & renters",
                    "Direct contact from interested parties",
                    "Featured on search results",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-foreground"
                    >
                      <div className="w-4 h-4 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-brand" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <Separator />

                <div className="space-y-3 pt-1">
                  <Button
                    data-ocid="payment.pay_button"
                    onClick={handlePayNow}
                    disabled={isCheckoutPending}
                    className="w-full bg-brand hover:bg-brand-dark text-white font-semibold h-12 text-base shadow-brand gap-2"
                  >
                    {isCheckoutPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting to payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pay ₹999 &amp; Publish Now
                      </>
                    )}
                  </Button>
                  <Button
                    data-ocid="payment.skip_button"
                    variant="ghost"
                    onClick={handleSkipPayment}
                    className="w-full gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <SkipForward className="w-4 h-4" />
                    Skip Payment (Demo)
                  </Button>
                </div>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground">
            {isTrialActive
              ? "Free trial valid for 3 days from your first visit"
              : "Secured by Stripe · 256-bit SSL encryption"}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Free Trial Banner */}
      <AnimatePresence>
        {isTrialActive && !trialBannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 bg-emerald-50 border border-emerald-300 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                  <Gift className="w-3.5 h-3.5 text-white" />
                </div>
                <p className="text-emerald-800 text-sm font-semibold truncate">
                  Free Trial Active — Post listings for free.{" "}
                  <span className="font-normal text-emerald-700">
                    {daysRemaining > 0
                      ? `${daysRemaining}d ${hoursRemaining}h remaining`
                      : `${hoursRemaining}h remaining`}
                  </span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTrialBannerDismissed(true)}
                className="shrink-0 text-emerald-500 hover:text-emerald-700 transition-colors"
                aria-label="Dismiss trial banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

          {/* Videos */}
          <section className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
              <Badge className="bg-brand text-white rounded-full w-6 h-6 flex items-center justify-center p-0 text-xs">
                6
              </Badge>
              Property Videos
              <span className="text-xs font-normal text-muted-foreground ml-1">
                (optional)
              </span>
            </h2>
            <VideoUploader
              initialUrls={[]}
              onChange={(urls) => updateField("videoUrls", urls)}
              maxVideos={3}
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
