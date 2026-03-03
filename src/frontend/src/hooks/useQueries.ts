import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ListingType, Property, PropertyType } from "../backend.d";
import { useActor } from "./useActor";

// ─── Query Keys ───
export const queryKeys = {
  properties: (filters?: PropertyFilters) => ["properties", filters],
  property: (id: bigint) => ["property", id.toString()],
  myProperties: ["myProperties"],
};

export interface PropertyFilters {
  city?: string | null;
  listingType?: ListingType | null;
  propertyType?: PropertyType | null;
  minPrice?: bigint | null;
  maxPrice?: bigint | null;
  minBedrooms?: bigint | null;
  maxBedrooms?: bigint | null;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  price: bigint;
  location: string;
  city: string;
  state: string;
  propertyType: PropertyType;
  listingType: ListingType;
  bedrooms: bigint;
  bathrooms: bigint;
  areaSqFt: bigint;
  contactName: string;
  contactPhone: string;
}

// ─── Get All Properties with Filters ───
export function useGetProperties(filters?: PropertyFilters) {
  const { actor, isFetching } = useActor();
  return useQuery<Property[]>({
    queryKey: queryKeys.properties(filters),
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProperties(
        filters?.city ?? null,
        filters?.listingType ?? null,
        filters?.propertyType ?? null,
        filters?.minPrice ?? null,
        filters?.maxPrice ?? null,
        filters?.minBedrooms ?? null,
        filters?.maxBedrooms ?? null,
      );
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Get Single Property ───
export function useGetProperty(id: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Property>({
    queryKey: queryKeys.property(id ?? BigInt(0)),
    queryFn: async () => {
      if (!actor || id === null) throw new Error("No actor or id");
      return actor.getProperty(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

// ─── Get My Properties ───
export function useGetMyProperties() {
  const { actor, isFetching } = useActor();
  return useQuery<Property[]>({
    queryKey: queryKeys.myProperties,
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyProperties();
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Create Property ───
export function useCreateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePropertyInput) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.createProperty(
        input.title,
        input.description,
        input.price,
        input.location,
        input.city,
        input.state,
        input.propertyType,
        input.listingType,
        input.bedrooms,
        input.bathrooms,
        input.areaSqFt,
        input.contactName,
        input.contactPhone,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.myProperties });
    },
  });
}

// ─── Update Property ───
export function useUpdateProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: { id: bigint; input: CreatePropertyInput }) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateProperty(
        id,
        input.title,
        input.description,
        input.price,
        input.location,
        input.city,
        input.state,
        input.propertyType,
        input.listingType,
        input.bedrooms,
        input.bathrooms,
        input.areaSqFt,
        input.contactName,
        input.contactPhone,
      );
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.myProperties });
      queryClient.invalidateQueries({ queryKey: queryKeys.property(id) });
    },
  });
}

// ─── Delete Property ───
export function useDeleteProperty() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.deleteProperty(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.myProperties });
    },
  });
}
