import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useRouter } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import {
  Award,
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  Copy,
  Gift,
  Home,
  Layers,
  MapPin,
  Search,
  Shield,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";
import { ListingType, PropertyType } from "../backend.d";
import PropertyCard from "../components/PropertyCard";
import ShareEarnCard from "../components/ShareEarnCard";
import { useFreeTrial } from "../hooks/useFreeTrial";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useReferral } from "../hooks/useReferral";
import { INDIAN_CITIES, SAMPLE_PROPERTIES } from "../utils/constants";

const LISTING_TABS = [
  { value: "buy", label: "Buy", icon: Home },
  { value: "rent", label: "Rent", icon: Building2 },
  { value: "commercial", label: "Commercial", icon: Briefcase },
  { value: "plots", label: "Plots", icon: Layers },
];

const STATS = [
  { label: "Properties Listed", value: "2.5L+", icon: Building2 },
  { label: "Cities Covered", value: "50+", icon: MapPin },
  { label: "Happy Families", value: "1L+", icon: Shield },
  { label: "Trusted Agents", value: "15K+", icon: Award },
];

const POPULAR_CITIES = [
  { name: "Mumbai", count: "45,000+ listings" },
  { name: "Delhi", count: "38,000+ listings" },
  { name: "Bangalore", count: "32,000+ listings" },
  { name: "Hyderabad", count: "28,000+ listings" },
  { name: "Pune", count: "22,000+ listings" },
  { name: "Chennai", count: "18,000+ listings" },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("buy");
  const router = useRouter();
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { isTrialActive, daysRemaining, hoursRemaining } = useFreeTrial();
  const { referralUrl, bonusDaysEarned } = useReferral();
  const [heroCopied, setHeroCopied] = useState(false);
  const [mobileShareOpen, setMobileShareOpen] = useState(false);

  async function handleHeroCopy() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setHeroCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setHeroCopied(false), 2000);
    } catch {
      setHeroCopied(true);
      setTimeout(() => setHeroCopied(false), 2000);
    }
  }

  function handleHeroWhatsApp() {
    const message = encodeURIComponent(
      `🏠 Check out Faisal Property — India's trusted property marketplace!\n\nFind or post properties across India.\n\n👉 ${referralUrl}\n\nSign up via my link and get 3 extra days of free listings!`,
    );
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener");
  }

  function handleSearch() {
    const params: Record<string, string> = {};
    if (searchQuery) params.city = searchQuery;
    if (activeTab === "buy") params.type = "buy";
    else if (activeTab === "rent") params.type = "rent";
    else if (activeTab === "commercial") params.propertyType = "commercial";
    else if (activeTab === "plots") params.propertyType = "plot";

    const queryString = new URLSearchParams(params).toString();
    router.navigate({ to: `/listings?${queryString}` } as never);
  }

  function handleCityClick(city: string) {
    router.navigate({ to: `/listings?city=${city}` } as never);
  }

  const featuredProperties = SAMPLE_PROPERTIES.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/assets/generated/hero-cityscape.dim_1400x600.jpg')`,
          }}
        />
        <div className="hero-gradient absolute inset-0" />

        {/* Hero Share & Earn Banner — pinned top right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="absolute top-5 right-4 z-20 hidden lg:block"
          data-ocid="home.hero_share_earn.card"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-2xl px-4 py-3 max-w-xs shadow-2xl">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-400/30 flex items-center justify-center shrink-0">
                <Gift className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-tight">
                  Share &amp; Earn 3 Free Days
                </p>
                {bonusDaysEarned > 0 && (
                  <p className="text-emerald-300 text-xs font-medium">
                    {bonusDaysEarned} bonus day
                    {bonusDaysEarned !== 1 ? "s" : ""} earned!
                  </p>
                )}
              </div>
            </div>
            <p className="text-white/75 text-xs mb-3 leading-relaxed">
              Invite friends via your link — you both get 3 bonus listing days
              free.
            </p>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={handleHeroCopy}
                data-ocid="home.hero_share_earn.copy_button"
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-xs font-semibold rounded-lg px-3 py-2 transition-all"
              >
                {heroCopied ? (
                  <>
                    <Check className="w-3 h-3" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copy Link
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleHeroWhatsApp}
                data-ocid="home.hero_share_earn.whatsapp_button"
                className="flex items-center justify-center gap-1.5 bg-[#25D366]/80 hover:bg-[#25D366] border border-[#25D366]/50 text-white text-xs font-semibold rounded-lg px-3 py-2 transition-all"
              >
                <SiWhatsapp className="w-3.5 h-3.5" />
                Share
              </button>
            </div>
          </div>
        </motion.div>

        <div className="relative z-10 container mx-auto px-4 py-20 text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <Badge className="mb-4 bg-brand/20 text-brand border-brand/30 text-sm font-medium">
              India's Premium Property Marketplace
            </Badge>
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold leading-tight mb-4">
              Find Your
              <br />
              <span className="text-brand">Dream Property</span>
              <br />
              in India
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-xl">
              Browse over 2.5 lakh listings across 50+ cities. Verified
              properties, transparent pricing, and expert guidance.
            </p>

            {/* Free Trial Badge */}
            {isTrialActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4, type: "spring" }}
                className="mb-5"
              >
                <div
                  data-ocid="home.free_trial_badge"
                  className="inline-flex items-center gap-2 bg-emerald-500/90 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg border border-emerald-400/50"
                >
                  <Gift className="w-4 h-4 shrink-0" />
                  <span>3 Days Free Trial — No payment needed!</span>
                  <span className="bg-white/25 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                    {daysRemaining > 0
                      ? `${daysRemaining}d ${hoursRemaining}h left`
                      : `${hoursRemaining}h left`}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Search Box */}
            <div className="bg-white rounded-2xl p-2 shadow-2xl max-w-2xl">
              {/* Tabs */}
              <div className="flex gap-1 mb-2 px-1 pt-1">
                {LISTING_TABS.map((tab) => (
                  <button
                    type="button"
                    key={tab.value}
                    data-ocid="home.listing_type.tab"
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                      activeTab === tab.value
                        ? "bg-brand text-white"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Input */}
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    data-ocid="home.search_input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="Search by city, locality..."
                    className="pl-9 border-0 bg-secondary text-foreground h-12 text-base focus-visible:ring-1 focus-visible:ring-brand"
                    list="city-suggestions"
                  />
                  <datalist id="city-suggestions">
                    {INDIAN_CITIES.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                </div>
                <Button
                  data-ocid="home.search_button"
                  onClick={handleSearch}
                  className="h-12 px-6 bg-brand hover:bg-brand-dark text-white font-semibold shadow-brand gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-heading font-extrabold text-brand">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/70 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-3xl font-extrabold text-foreground">
              Featured Properties
            </h2>
            <p className="text-muted-foreground mt-1">
              Handpicked properties across India's top cities
            </p>
          </div>
          <Link to="/listings">
            <Button
              variant="outline"
              className="gap-2 border-brand text-brand hover:bg-brand/10"
            >
              View All
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((property, i) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <PropertyCard property={property} index={i + 1} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-extrabold text-foreground">
              Explore by City
            </h2>
            <p className="text-muted-foreground mt-2">
              Properties in India's most sought-after cities
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {POPULAR_CITIES.map((city, i) => (
              <motion.button
                key={city.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.04 }}
                onClick={() => handleCityClick(city.name)}
                className="bg-card border border-border rounded-xl p-4 text-center hover:border-brand hover:shadow-card-hover transition-all cursor-pointer"
              >
                <MapPin className="w-6 h-6 text-brand mx-auto mb-2" />
                <div className="font-heading font-bold text-foreground">
                  {city.name}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {city.count}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Share & Earn Section */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="font-heading text-3xl font-extrabold text-foreground">
            Share & Earn Free Listing Days
          </h2>
          <p className="text-muted-foreground mt-2">
            Invite friends to Faisal Property and both of you get 3 bonus days
            free
          </p>
        </div>
        <div className="max-w-2xl mx-auto">
          <ShareEarnCard
            referralUrl={referralUrl}
            bonusDaysEarned={bonusDaysEarned}
          />
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="w-64 h-64 rounded-full bg-brand absolute -top-20 -right-20" />
              <div className="w-40 h-40 rounded-full bg-brand absolute -bottom-10 -left-10" />
            </div>
            <div className="relative z-10">
              <Badge className="mb-4 bg-brand/20 text-brand border-brand/30">
                Post for Free
              </Badge>
              <h2 className="font-heading text-3xl font-extrabold text-primary-foreground mb-3">
                Own a Property? List it on Faisal Property
              </h2>
              <p className="text-primary-foreground/70 mb-8 max-w-md mx-auto">
                Reach thousands of serious buyers and tenants. Post your
                property for free today.
              </p>
              <Button
                onClick={login}
                className="bg-brand hover:bg-brand-dark text-white font-semibold px-8 py-3 h-auto text-base shadow-brand"
              >
                Login to Post Property
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl font-extrabold text-foreground">
            Why Faisal Property?
          </h2>
          <p className="text-muted-foreground mt-2">
            Trusted by over 1 lakh families across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Verified Listings",
              desc: "Every property is verified by our team. No fake listings, no hidden surprises.",
            },
            {
              icon: TrendingUp,
              title: "Best Price Guarantee",
              desc: "We ensure you get the best price in the market with transparent pricing.",
            },
            {
              icon: Award,
              title: "Expert Guidance",
              desc: "Our real estate experts guide you through the entire buying or renting journey.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center space-y-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto">
                <item.icon className="w-7 h-7 text-brand" />
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground">
                {item.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mobile Floating Share & Earn FAB */}
      <motion.button
        type="button"
        data-ocid="home.mobile_share_earn.button"
        onClick={() => setMobileShareOpen(true)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4, type: "spring" }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-5 right-4 z-30 block lg:hidden flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold text-sm px-4 py-3 rounded-full shadow-lg shadow-emerald-500/40 transition-colors"
        aria-label="Share &amp; Earn free listing days"
      >
        <Gift className="w-4 h-4 shrink-0" />
        <span>Share &amp; Earn</span>
      </motion.button>

      {/* Mobile Share & Earn Bottom Drawer */}
      <Drawer open={mobileShareOpen} onOpenChange={setMobileShareOpen}>
        <DrawerContent
          data-ocid="home.mobile_share_earn.drawer"
          className="lg:hidden"
        >
          <DrawerHeader className="pb-2">
            <DrawerTitle className="font-heading text-xl font-extrabold text-foreground flex items-center gap-2">
              <Gift className="w-5 h-5 text-emerald-500" />
              Share &amp; Earn Free Days
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            <ShareEarnCard
              referralUrl={referralUrl}
              bonusDaysEarned={bonusDaysEarned}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
