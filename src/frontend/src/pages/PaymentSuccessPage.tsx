import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, Home, ListFilter } from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <AnimatePresence>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-md w-full text-center space-y-6"
          data-ocid="payment.success_state"
        >
          {/* Animated check circle */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <div className="relative">
              {/* Outer glow ring */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.4, opacity: 0 }}
                transition={{
                  duration: 1.2,
                  repeat: 2,
                  repeatType: "loop",
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full bg-green-400"
              />
              <div className="w-24 h-24 rounded-full bg-green-50 border-4 border-green-200 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  <CheckCircle2
                    className="w-12 h-12 text-green-500"
                    strokeWidth={1.5}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="font-heading text-3xl font-extrabold text-foreground">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Your property listing is now live. Buyers and renters can find it
              right away.
            </p>
          </motion.div>

          {/* Info card */}
          <motion.div
            variants={itemVariants}
            className="bg-green-50 border border-green-100 rounded-xl px-5 py-4 text-left space-y-2"
          >
            {[
              "Your listing is visible to thousands of users",
              "You'll be contacted directly by interested parties",
              "Listing remains active for 90 days",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2 text-sm text-green-800"
              >
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link to="/my-listings">
              <Button
                data-ocid="payment.my_listings_link"
                className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white font-semibold shadow-brand gap-2"
              >
                <ListFilter className="w-4 h-4" />
                View My Listings
              </Button>
            </Link>
            <Link to="/listings">
              <Button
                data-ocid="payment.browse_listings_link"
                variant="outline"
                className="w-full sm:w-auto gap-2"
              >
                <Home className="w-4 h-4" />
                Browse Listings
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
