import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CreditCard, ListFilter, XCircle } from "lucide-react";
import { type Variants, motion } from "motion/react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full text-center space-y-6"
        data-ocid="payment.cancelled_state"
      >
        {/* Icon */}
        <motion.div variants={itemVariants} className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-orange-50 border-4 border-orange-100 flex items-center justify-center">
            <XCircle className="w-12 h-12 text-orange-400" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Text */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="font-heading text-3xl font-extrabold text-foreground">
            Payment Cancelled
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Your property was saved but not published. Complete the payment to
            make it visible to buyers and renters.
          </p>
        </motion.div>

        {/* Info card */}
        <motion.div
          variants={itemVariants}
          className="bg-orange-50 border border-orange-100 rounded-xl px-5 py-4 text-left"
        >
          <p className="text-sm text-orange-800 font-medium mb-1">
            What happened?
          </p>
          <p className="text-sm text-orange-700 leading-relaxed">
            You cancelled the payment process. Your property details are safely
            stored — you can retry the payment from your listings page to
            publish it.
          </p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link to="/post">
            <Button
              data-ocid="payment.retry_button"
              className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white font-semibold shadow-brand gap-2"
            >
              <CreditCard className="w-4 h-4" />
              Post New Property
            </Button>
          </Link>
          <Link to="/my-listings">
            <Button
              data-ocid="payment.my_listings_link"
              variant="outline"
              className="w-full sm:w-auto gap-2"
            >
              <ListFilter className="w-4 h-4" />
              My Listings
            </Button>
          </Link>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="payment.home_link"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
