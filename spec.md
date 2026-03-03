# FS Realty

## Current State
A real estate listings platform where users can post, browse, and filter properties (apartments, villas, plots, commercial). Features include:
- Internet Identity authentication
- Property creation, editing, deletion
- Photo uploads via blob-storage
- Filtering by city, listing type, property type, price, bedrooms
- Authorization with role-based access control

## Requested Changes (Diff)

### Add
- Stripe payment integration for property listing fees
- A "Post Property" payment step: before a listing goes live, the user must pay a listing fee via Stripe
- Payment history page showing past transactions for the logged-in user
- Backend: store payment records (paymentId, propertyId, amount, status, createdAt, paidBy)
- Backend: `createPaymentIntent` to initiate a Stripe payment for a listing fee
- Backend: `confirmPayment` to mark a listing as paid and activate it
- Backend: `getMyPayments` to retrieve payment history for the caller
- Frontend: PaymentPage component shown after property form submission (before listing goes live)
- Frontend: Stripe checkout UI (card input, pay button)
- Frontend: Payment success/failure states
- Frontend: Payment history tab in "My Listings" page

### Modify
- `createProperty` flow: newly created properties start as `isActive = false` until payment is confirmed
- PostPropertyPage: after form submission, redirect to payment step
- MyListingsPage: add a "Payments" tab

### Remove
- Nothing removed
