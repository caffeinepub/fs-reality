import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export type Principal = Principal;
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Property {
    id: bigint;
    title: string;
    photoUrls: Array<string>;
    postedAt: Time;
    postedBy: Principal;
    contactName: string;
    propertyType: PropertyType;
    bedrooms: bigint;
    city: string;
    description: string;
    isActive: boolean;
    listingType: ListingType;
    state: string;
    areaSqFt: bigint;
    bathrooms: bigint;
    price: bigint;
    location: string;
    contactPhone: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    name: string;
}
export enum ListingType {
    buy = "buy",
    rent = "rent"
}
export enum PropertyType {
    commercial = "commercial",
    villa = "villa",
    plot = "plot",
    apartment = "apartment"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createProperty(title: string, description: string, price: bigint, location: string, city: string, state: string, propertyType: PropertyType, listingType: ListingType, bedrooms: bigint, bathrooms: bigint, areaSqFt: bigint, contactName: string, contactPhone: string, photoUrls: Array<string>): Promise<bigint>;
    deleteProperty(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyProperties(): Promise<Array<Property>>;
    getProperties(city: string | null, listingType: ListingType | null, propertyType: PropertyType | null, minPrice: bigint | null, maxPrice: bigint | null, minBedrooms: bigint | null, maxBedrooms: bigint | null): Promise<Array<Property>>;
    getProperty(id: bigint): Promise<Property | null>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateProperty(id: bigint, title: string, description: string, price: bigint, location: string, city: string, state: string, propertyType: PropertyType, listingType: ListingType, bedrooms: bigint, bathrooms: bigint, areaSqFt: bigint, contactName: string, contactPhone: string, photoUrls: Array<string>): Promise<void>;
}
