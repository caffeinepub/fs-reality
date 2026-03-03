import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
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
export type Time = bigint;
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
    createProperty(title: string, description: string, price: bigint, location: string, city: string, state: string, propertyType: PropertyType, listingType: ListingType, bedrooms: bigint, bathrooms: bigint, areaSqFt: bigint, contactName: string, contactPhone: string, photoUrls: Array<string>): Promise<bigint>;
    deleteProperty(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyProperties(): Promise<Array<Property>>;
    getProperties(city: string | null, listingType: ListingType | null, propertyType: PropertyType | null, minPrice: bigint | null, maxPrice: bigint | null, minBedrooms: bigint | null, maxBedrooms: bigint | null): Promise<Array<Property>>;
    getProperty(id: bigint): Promise<Property | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProperty(id: bigint, title: string, description: string, price: bigint, location: string, city: string, state: string, propertyType: PropertyType, listingType: ListingType, bedrooms: bigint, bathrooms: bigint, areaSqFt: bigint, contactName: string, contactPhone: string, photoUrls: Array<string>): Promise<void>;
}
