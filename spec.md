# FS Reality

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Real estate property listings platform inspired by 99acres
- Browse listings by category: Buy, Rent, Commercial, Plots/Land
- Property listing card with photo, price, location, bedrooms, bathrooms, area (sq ft)
- Search and filter by: location, price range, property type, BHK (bedrooms), area
- Post a new property listing (authenticated users)
- Property detail page with full description, specs, and contact info
- User dashboard to manage own listings (edit, delete)
- Sample listings seeded with realistic Indian real estate data
- Internet Identity authentication for posting

### Modify
- N/A (new project)

### Remove
- N/A (new project)

## Implementation Plan

### Backend
- `Property` data type: id, title, description, price, location, city, state, propertyType (Apartment/Villa/Plot/Commercial), listingType (Buy/Rent), bedrooms, bathrooms, area, postedBy (principal), postedAt, images (text array), contactName, contactPhone, isActive
- `createProperty(input)` -- authenticated, creates listing
- `getProperties(filters)` -- public, returns filtered listings
- `getProperty(id)` -- public, returns single listing
- `updateProperty(id, input)` -- authenticated, only owner can update
- `deleteProperty(id)` -- authenticated, only owner can delete
- `getUserProperties()` -- authenticated, returns caller's listings
- Seed sample data with realistic Indian real estate listings across cities (Mumbai, Delhi, Bangalore, Chennai, Hyderabad)

### Frontend
- Homepage with hero search bar, featured listings grid, category quick-links
- Listings browse page with sidebar filters (price, type, BHK, area) and grid/list view toggle
- Property detail page with image gallery placeholder, full specs table, contact card
- Post property form (multi-step or single page) with all fields
- My Listings dashboard for authenticated user
- Internet Identity login/logout in navbar
- Responsive layout with clean card-based design
