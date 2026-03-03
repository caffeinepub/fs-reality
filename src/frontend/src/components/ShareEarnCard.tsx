import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy, Gift, Share2 } from "lucide-react";
import { useState } from "react";
import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";
import { toast } from "sonner";

interface ShareEarnCardProps {
  referralUrl: string;
  bonusDaysEarned: number;
}

export default function ShareEarnCard({
  referralUrl,
  bonusDaysEarned,
}: ShareEarnCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      toast.success("Referral link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers that don't support clipboard API
      const el = document.createElement("textarea");
      el.value = referralUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      toast.success("Referral link copied!");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleWhatsApp() {
    const message = encodeURIComponent(
      `🏠 Check out Faisal Property — India's trusted property marketplace!\n\nFind or post properties to buy, sell & rent across India.\n\n👉 ${referralUrl}\n\nSign up via my link and get 3 extra days of free listings!`,
    );
    window.open(`https://wa.me/?text=${message}`, "_blank", "noopener");
  }

  function handleFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`,
      "_blank",
      "noopener",
    );
  }

  async function handleInstagram() {
    try {
      await navigator.clipboard.writeText(referralUrl);
    } catch {
      const el = document.createElement("textarea");
      el.value = referralUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    toast.success(
      "Link copied! Open Instagram and paste in your story or bio.",
    );
  }

  return (
    <div
      className="bg-card border-2 border-emerald-300 rounded-2xl overflow-hidden shadow-sm"
      data-ocid="share_earn.card"
    >
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 px-6 py-5 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
        <div className="absolute -bottom-4 right-16 w-16 h-16 rounded-full bg-white/10" />

        <div className="relative flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                <Gift className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white font-heading font-extrabold text-lg leading-tight">
                Share & Earn 3 Extra Days Free!
              </h3>
            </div>
            <p className="text-emerald-50 text-sm leading-relaxed max-w-sm">
              Share Faisal Property with friends. Every time someone joins via
              your link, you <strong className="text-white">both</strong> get 3
              bonus days of free listings.
            </p>
          </div>
        </div>

        {bonusDaysEarned > 0 && (
          <div className="relative mt-3">
            <Badge className="bg-white/25 text-white border border-white/40 font-semibold gap-1.5 px-3 py-1 text-sm">
              <Check className="w-3.5 h-3.5" />
              You've earned {bonusDaysEarned} bonus day
              {bonusDaysEarned !== 1 ? "s" : ""}!
            </Badge>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-4">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Your Unique Referral Link
          </p>
          <div className="flex gap-2">
            <Input
              readOnly
              value={referralUrl}
              className="flex-1 text-sm font-mono bg-muted/50 border-emerald-200 focus-visible:ring-emerald-400 truncate"
              data-ocid="share_earn.referral_url_input"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0 border-emerald-300 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-400 transition-colors"
              aria-label="Copy referral link"
              data-ocid="share_earn.copy_button"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <Button
            type="button"
            onClick={handleCopy}
            variant="outline"
            className="gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-400 font-semibold text-sm"
            data-ocid="share_earn.copy_button"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 shrink-0" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 shrink-0" />
                Copy Link
              </>
            )}
          </Button>
          <Button
            type="button"
            onClick={handleWhatsApp}
            className="gap-2 bg-[#25D366] hover:bg-[#1ebe59] text-white font-semibold shadow-sm text-sm"
            data-ocid="share_earn.whatsapp_button"
          >
            <SiWhatsapp className="w-4 h-4 shrink-0" />
            WhatsApp
          </Button>
          <Button
            type="button"
            onClick={handleFacebook}
            className="gap-2 bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold shadow-sm text-sm"
            data-ocid="share_earn.facebook_button"
          >
            <SiFacebook className="w-4 h-4 shrink-0" />
            Facebook
          </Button>
          <Button
            type="button"
            onClick={handleInstagram}
            className="gap-2 text-white font-semibold shadow-sm text-sm"
            style={{
              background:
                "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            }}
            data-ocid="share_earn.instagram_button"
          >
            <SiInstagram className="w-4 h-4 shrink-0" />
            Instagram
          </Button>
        </div>

        <div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
          <Share2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-800 leading-relaxed">
            <strong>How it works:</strong> Anyone who visits Faisal Property
            through your link gets 3 bonus days added to their trial. You also
            earn 3 bonus days for every person who joins!
          </p>
        </div>
      </div>
    </div>
  );
}
