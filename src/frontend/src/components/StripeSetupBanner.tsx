import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, CreditCard, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useSetStripeConfiguration } from "../hooks/useCheckout";

interface StripeSetupBannerProps {
  onConfigured?: () => void;
}

export default function StripeSetupBanner({
  onConfigured,
}: StripeSetupBannerProps) {
  const [secretKey, setSecretKey] = useState("");
  const [allowedCountries, setAllowedCountries] = useState("IN,US,GB");
  const [showKey, setShowKey] = useState(false);
  const [configured, setConfigured] = useState(false);

  const { mutateAsync: setConfig, isPending } = useSetStripeConfiguration();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!secretKey.trim()) {
      toast.error("Secret key is required");
      return;
    }
    if (!secretKey.startsWith("sk_")) {
      toast.error("Secret key must start with 'sk_'");
      return;
    }

    try {
      const countries = allowedCountries
        .split(",")
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean);

      await setConfig({
        secretKey: secretKey.trim(),
        allowedCountries: countries,
      });
      setConfigured(true);
      toast.success("Stripe configured successfully!");
      onConfigured?.();
    } catch (err) {
      console.error(err);
      toast.error("Failed to configure Stripe. Please try again.");
    }
  }

  if (configured) {
    return (
      <div
        className="bg-green-50 border border-green-200 rounded-2xl p-6 flex items-center gap-4"
        data-ocid="stripe.setup.success_state"
      >
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-semibold text-green-800">
            Stripe configured successfully
          </p>
          <p className="text-sm text-green-700">
            Payment processing is now active.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-card"
      data-ocid="stripe.setup.panel"
    >
      {/* Header */}
      <div className="bg-brand/5 border-b border-border px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-brand/10 flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-brand" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-foreground">
            Stripe Payment Setup
          </h3>
          <p className="text-xs text-muted-foreground">
            Configure Stripe to enable listing fee payments
          </p>
        </div>
        <div className="ml-auto">
          <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full">
            Not configured
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Secret key */}
        <div className="space-y-2">
          <Label htmlFor="stripe-secret-key">Stripe Secret Key</Label>
          <div className="relative">
            <Input
              id="stripe-secret-key"
              data-ocid="stripe.secret_key.input"
              type={showKey ? "text" : "password"}
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="sk_live_... or sk_test_..."
              className="pr-10 font-mono text-sm"
              autoComplete="off"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowKey(!showKey)}
              aria-label={showKey ? "Hide key" : "Show key"}
            >
              {showKey ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Find this in your Stripe Dashboard → Developers → API Keys
          </p>
        </div>

        {/* Allowed countries */}
        <div className="space-y-2">
          <Label htmlFor="stripe-countries">Allowed Countries</Label>
          <Input
            id="stripe-countries"
            data-ocid="stripe.countries.input"
            value={allowedCountries}
            onChange={(e) => setAllowedCountries(e.target.value)}
            placeholder="IN,US,GB,AU"
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated ISO country codes (e.g. IN,US,GB)
          </p>
        </div>

        <Button
          type="submit"
          data-ocid="stripe.setup.submit_button"
          disabled={isPending}
          className="bg-brand hover:bg-brand-dark text-white font-semibold shadow-brand gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Save Stripe Configuration
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
