import { Skeleton } from "@/components/ui/skeleton";
import { Settings, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import StripeSetupBanner from "../components/StripeSetupBanner";
import { useIsCallerAdmin, useIsStripeConfigured } from "../hooks/useCheckout";

export default function AdminPage() {
  const { data: isAdmin, isLoading: isAdminLoading } = useIsCallerAdmin();
  const {
    data: isStripeConfigured,
    isLoading: isStripeLoading,
    refetch: refetchStripe,
  } = useIsStripeConfigured();

  if (isAdminLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="space-y-4">
          <Skeleton className="h-10 w-56" />
          <Skeleton className="h-5 w-72" />
          <Skeleton className="h-48 w-full rounded-2xl mt-8" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        className="min-h-[70vh] flex items-center justify-center px-4"
        data-ocid="admin.page"
      >
        <div className="max-w-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="font-heading text-2xl font-extrabold text-foreground">
            Access Denied
          </h1>
          <p className="text-muted-foreground">
            You don't have permission to access the admin panel. Only
            administrators can manage app settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mx-auto px-4 py-10 max-w-2xl"
      data-ocid="admin.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <Settings className="w-5 h-5 text-brand" />
          </div>
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-foreground">
              Admin Settings
            </h1>
            <p className="text-muted-foreground text-sm">
              Configure payment processing for FS Realty
            </p>
          </div>
        </div>

        {/* Stripe setup section */}
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-base text-foreground flex items-center gap-2">
            Payment Configuration
          </h2>

          {isStripeLoading ? (
            <Skeleton className="h-48 w-full rounded-2xl" />
          ) : isStripeConfigured ? (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 space-y-1">
              <p className="font-semibold text-green-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                Stripe is active
              </p>
              <p className="text-sm text-green-700">
                Payment processing is configured and ready to accept payments.
              </p>
            </div>
          ) : (
            <StripeSetupBanner onConfigured={() => refetchStripe()} />
          )}
        </section>
      </motion.div>
    </div>
  );
}
