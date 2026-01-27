# IFROF Shopping Cart & Checkout System - Complete Implementation

## Overview

This document describes the complete, production-ready shopping cart and checkout system for IFROF.COM, including Stripe payment integration, webhook handling, and email confirmations.

## Architecture

### Database Schema

The system uses the following database tables:

- **cartItems**: Stores user shopping cart items
  - `id`: Primary key
  - `userId`: Reference to user
  - `productId`: Reference to product
  - `quantity`: Item quantity
  - `createdAt`, `updatedAt`: Timestamps

- **orders**: Stores completed orders
  - `id`: Primary key
  - `buyerId`: Reference to buyer user
  - `factoryId`: Reference to factory
  - `orderNumber`: Unique order identifier
  - `items`: JSON array of order items
  - `totalAmount`: Total in cents
  - `status`: Order status (pending, confirmed, processing, shipped, delivered, cancelled)
  - `paymentStatus`: Payment status (pending, completed, failed, refunded)
  - `stripePaymentIntentId`: Stripe session ID
  - `shippingAddress`: JSON object with address details
  - `notes`: Optional order notes
  - `createdAt`, `updatedAt`: Timestamps

- **notifications**: Stores user notifications
  - `id`: Primary key
  - `userId`: Reference to user
  - `type`: Notification type
  - `title`: Notification title
  - `message`: Notification message
  - `relatedEntityId`: Reference to related entity (order, etc.)
  - `read`: Read status (0 or 1)
  - `createdAt`: Timestamp

## Frontend Components

### 1. Cart Page (`/cart`)

**File**: `client/src/pages/Cart.tsx`

Features:

- Display all cart items with product images, names, prices
- Quantity adjustment with +/- buttons
- Remove item functionality
- Clear cart option
- Order summary with subtotal calculation
- "Continue Shopping" and "Proceed to Checkout" buttons
- Real-time cart persistence

### 2. Checkout Page (`/checkout`)

**File**: `client/src/pages/CheckoutImproved.tsx`

Multi-step checkout flow:

**Step 1: Shipping Address**

- Full name, address, city, state, ZIP, country, phone
- Client-side validation with error messages
- Required field indicators

**Step 2: Shipping Method**

- Standard Shipping (5-7 business days)
- Express Shipping (2-3 business days)
- Optional order notes
- Dynamic pricing based on method

**Step 3: Payment**

- Stripe payment information
- Secure payment badge
- Accepted payment methods display
- Order summary sidebar

Features:

- Step indicator with progress
- Back/Next navigation
- Real-time order summary
- Form validation
- Error handling

### 3. Orders Page (`/orders`)

**File**: `client/src/pages/Orders.tsx`

Features:

- List all user orders
- Order status badges
- Order details (date, amount, status)
- Payment status indicator
- View Details button
- Track Shipment button (placeholder)
- Success message for recent payments

### 4. Order Detail Page (`/orders/:orderId`)

**File**: `client/src/pages/OrderDetail.tsx`

Features:

- Complete order information
- Order items with quantities and prices
- Shipping address display
- Order summary with breakdown
- Payment information
- Order status tracking
- Download invoice button (placeholder)
- Track shipment button (placeholder)

## Backend Routers

### 1. Cart Router (`server/routers/cart.ts`)

**Endpoints:**

- `cart.getItems` - Get user's cart items with product details
- `cart.addItem` - Add product to cart (with MOQ validation)
- `cart.removeItem` - Remove item from cart
- `cart.updateQuantity` - Update item quantity
- `cart.clear` - Clear entire cart
- `cart.getSummary` - Get cart summary (totals, counts)

**Features:**

- Database-backed persistence
- Minimum order quantity validation
- Product availability checking

### 2. Improved Checkout Router (`server/routers/checkout-improved.ts`)

**Endpoints:**

- `checkout.getSummary` - Get checkout summary with cart items
- `checkout.validateShippingAddress` - Validate address format
- `checkout.createCheckoutSession` - Create Stripe session and order
- `checkout.getOrderBySession` - Retrieve order by Stripe session
- `checkout.clearCartAfterCheckout` - Clear cart after successful order

**Features:**

- Comprehensive order validation
- Stripe checkout session creation
- Order persistence to database
- Cart clearing after checkout

### 3. Payments Router (`server/routers/payments.ts`)

**Endpoints:**

- `payments.createCheckout` - Create checkout session (legacy)
- `payments.getOrderBySession` - Get order by session ID
- `payments.getOrders` - Get user's orders
- `payments.getOrder` - Get specific order details
- `payments.updateOrderStatus` - Update order status (admin/factory only)
- `payments.getFactoryOrders` - Get factory's orders

## Stripe Integration

### Webhook Handler (`server/_core/stripe-webhook.ts`)

**Registered Endpoint**: `POST /api/stripe/webhook`

**Events Handled:**

1. **checkout.session.completed**
   - Updates order status to "confirmed"
   - Sets payment status to "completed"
   - Sends order confirmation email
   - Creates notification for buyer

2. **charge.failed**
   - Sends payment failed email
   - Creates notification for buyer
   - Logs failure for debugging

3. **charge.refunded**
   - Updates order status to "cancelled"
   - Sets payment status to "refunded"
   - Sends refund notification email
   - Creates notification for buyer

**Features:**

- Signature verification using webhook secret
- Error handling and logging
- Database transaction updates
- Email notifications

### Stripe Configuration

**Environment Variables:**

```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Webhook URL**: `https://ifrof.com/api/stripe/webhook`

## Email Service (`server/_core/email-service.ts`)

### Functions

1. **sendOrderConfirmationEmail(data)**
   - Sends HTML-formatted order confirmation
   - Includes order items, totals, shipping address
   - Professional email template
   - Text and HTML versions

2. **sendPaymentFailedEmail(email, name, orderNumber, reason)**
   - Notifies buyer of payment failure
   - Includes retry instructions
   - Support contact information

### Email Configuration

**Environment Variables:**

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@ifrof.com
```

**SMTP Settings:**

- Service: Gmail
- Port: 587 (TLS)
- Authentication: OAuth2 or App Password

## Order Flow

### 1. Add to Cart

```
User adds product → Cart router validates MOQ → Item stored in database
```

### 2. Checkout

```
User navigates to /checkout
→ Checkout page loads cart items
→ User enters shipping address
→ User selects shipping method
→ User clicks "Place Order"
→ Checkout router creates Stripe session
→ Order created in database (status: pending)
→ User redirected to Stripe checkout
```

### 3. Payment

```
User completes Stripe payment
→ Stripe processes payment
→ Webhook event sent to /api/stripe/webhook
→ Order status updated to "confirmed"
→ Payment status updated to "completed"
→ Order confirmation email sent
→ Notification created for buyer
```

### 4. Order Management

```
User views /orders
→ Displays all user orders
→ User clicks "View Details"
→ OrderDetail page shows full order information
```

## Data Flow Diagrams

### Cart Persistence

```
Frontend (Cart.tsx)
    ↓
tRPC Client
    ↓
Cart Router (cart.ts)
    ↓
Database (cartItems table)
    ↓
Response with product details
```

### Checkout & Payment

```
Frontend (CheckoutImproved.tsx)
    ↓
Checkout Router (checkout-improved.ts)
    ↓
Create Stripe Session
    ↓
Create Order in Database
    ↓
Return checkout URL
    ↓
Redirect to Stripe
    ↓
User completes payment
    ↓
Stripe Webhook → /api/stripe/webhook
    ↓
Update Order Status
    ↓
Send Confirmation Email
    ↓
Create Notification
```

## Error Handling

### Frontend

- Form validation with error messages
- Toast notifications for errors
- Graceful fallbacks for missing data
- Loading states during async operations

### Backend

- Input validation with Zod schemas
- TRPC error codes (UNAUTHORIZED, NOT_FOUND, BAD_REQUEST, etc.)
- Database transaction rollback on failure
- Comprehensive logging

### Stripe

- Signature verification
- Retry logic for failed webhooks
- Error logging and monitoring
- Fallback email notifications

## Security Features

1. **Authentication**
   - Protected procedures require user authentication
   - User ownership verification for orders

2. **Validation**
   - Input validation with Zod schemas
   - Shipping address validation
   - Minimum order quantity checks

3. **Payment Security**
   - Stripe webhook signature verification
   - No sensitive payment data stored locally
   - HTTPS-only communication

4. **Rate Limiting**
   - API rate limiting on checkout endpoints
   - Stripe webhook rate limiting exempt

## Testing Checklist

### Cart Operations

- [ ] Add item to cart
- [ ] Update item quantity
- [ ] Remove item from cart
- [ ] Clear entire cart
- [ ] Cart persists after page refresh
- [ ] Minimum order quantity validation

### Checkout Flow

- [ ] Navigate through all checkout steps
- [ ] Validate shipping address errors
- [ ] Select different shipping methods
- [ ] Add order notes
- [ ] View order summary

### Payment Processing

- [ ] Complete Stripe payment
- [ ] Verify order created in database
- [ ] Confirm order status updated
- [ ] Check order confirmation email sent
- [ ] View order in /orders page
- [ ] View order details in /orders/:id

### Webhook Handling

- [ ] Webhook signature verification
- [ ] Order status updates correctly
- [ ] Payment status updates correctly
- [ ] Email notifications sent
- [ ] Notifications created in database

### Error Scenarios

- [ ] Empty cart checkout
- [ ] Invalid shipping address
- [ ] Payment declined
- [ ] Network errors
- [ ] Webhook retry logic

## Deployment Checklist

### Environment Variables

- [ ] `STRIPE_SECRET_KEY` configured
- [ ] `STRIPE_WEBHOOK_SECRET` configured
- [ ] `EMAIL_USER` configured
- [ ] `EMAIL_PASSWORD` configured
- [ ] `EMAIL_FROM` configured
- [ ] `DATABASE_URL` configured

### Stripe Configuration

- [ ] Webhook endpoint registered
- [ ] Webhook secret saved
- [ ] Test mode keys configured
- [ ] Live mode keys ready for production

### Email Configuration

- [ ] Gmail app password generated
- [ ] Email templates tested
- [ ] Reply-to address configured

### Database

- [ ] Migration scripts run
- [ ] Tables created
- [ ] Indexes created
- [ ] Backup strategy implemented

## Performance Optimization

1. **Database Queries**
   - Cart items fetched with product details in single query
   - Order queries use indexes on userId and factoryId

2. **Frontend**
   - Lazy loading of order details
   - Pagination on orders list
   - Memoization of cart components

3. **Email**
   - Async email sending (non-blocking)
   - Email queue for retry logic

## Future Enhancements

1. **Order Tracking**
   - Shipment tracking integration
   - Real-time delivery updates
   - Carrier API integration

2. **Refunds**
   - Refund request system
   - Automated refund processing
   - Refund status tracking

3. **Invoices**
   - PDF invoice generation
   - Invoice download
   - Invoice email delivery

4. **Analytics**
   - Order analytics dashboard
   - Conversion funnel tracking
   - Revenue reporting

5. **Internationalization**
   - Multi-currency support
   - Localized email templates
   - Regional shipping options

## Support

For issues or questions about the checkout system, contact the development team or refer to the Stripe documentation at https://stripe.com/docs.
