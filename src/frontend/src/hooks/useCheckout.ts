import { useMutation, useQuery } from "@tanstack/react-query";
import type { ShoppingItem } from "../backend.d";
import { useActor } from "./useActor";

// ─── Create Checkout Session ───
export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: ShoppingItem[];
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Not authenticated");
      const result = await actor.createCheckoutSession(
        items,
        successUrl,
        cancelUrl,
      );
      const session = JSON.parse(result) as { id: string; url: string };
      if (!session.url)
        throw new Error("Payment session URL missing. Please try again.");
      return session;
    },
  });
}

// ─── Is Stripe Configured ───
export function useIsStripeConfigured() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Is Caller Admin ───
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Set Stripe Configuration ───
export function useSetStripeConfiguration() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      secretKey,
      allowedCountries,
    }: {
      secretKey: string;
      allowedCountries: string[];
    }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.setStripeConfiguration({ secretKey, allowedCountries });
    },
  });
}

// ─── Get Stripe Session Status ───
export function useGetStripeSessionStatus(sessionId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stripeSession", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) throw new Error("Missing actor or sessionId");
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
  });
}
