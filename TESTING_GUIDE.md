# IFROF Checkout System - Testing Guide

## Prerequisites

Before testing, ensure the following environment variables are configured:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email Configuration (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@ifrof.com

# Database
DATABASE_URL=mysql://user:password@localhost:3306/ifrof

# Server
NODE_ENV=development
PORT=3000
```

## Test Data Setup

### 1. Create Test User

Use the OAuth login or create a user directly in the database:

```sql
INSERT INTO users (openId, name, email, role, loginMethod)
VALUES ('test-user-001', 'Test User', 'test@example.com', 'buyer', 'oauth');
```

### 2. Create Test Factory

```sql
INSERT INTO factories (userId, name, description, location, verificationStatus)
VALUES (1, 'Test Factory', 'A test factory', 'China', 'verified');
```

### 3. Create Test Products

```sql
INSERT INTO products (factoryId, name, description, basePrice, minimumOrderQuantity, active)
VALUES
(1, 'Test Product 1', 'A test product', 5000, 1, 1),
(1, 'Test Product 2', 'Another test product', 10000, 2, 1);
```

## Manual Testing Flow

### Test 1: Add Items to Cart

**Steps:**

1. Navigate to `/marketplace`
2. Find a product and click "Add to Cart"
3. Select quantity (must be >= minimum order quantity)
4. Click "Add to Cart" button

**Expected Results:**

- Toast notification shows "Item added to cart"
- Cart count updates in header
- Item appears in cart page

**Verification:**

```bash
# Check database
SELECT * FROM cart_items WHERE userId = 1;
```

### Test 2: View Cart

**Steps:**

1. Navigate to `/cart`
2. Verify all items are displayed
3. Check quantities and prices

**Expected Results:**

- All cart items displayed with images, names, prices
- Subtotal calculated correctly
- "Proceed to Checkout" button enabled

### Test 3: Update Cart Quantity

**Steps:**

1. On cart page, click +/- buttons to adjust quantity
2. Or directly edit the quantity input field
3. Verify quantity updates

**Expected Results:**

- Quantity updates immediately
- Subtotal recalculates
- Changes persist after page refresh

**Verification:**

```bash
# Check database
SELECT * FROM cart_items WHERE userId = 1 AND productId = 1;
```

### Test 4: Remove Item from Cart

**Steps:**

1. On cart page, click trash icon next to item
2. Verify item is removed

**Expected Results:**

- Item removed from cart
- Subtotal recalculates
- Toast notification shows "Item removed"

**Verification:**

```bash
# Check database - item should not exist
SELECT * FROM cart_items WHERE userId = 1 AND productId = 1;
```

### Test 5: Checkout - Shipping Address

**Steps:**

1. Click "Proceed to Checkout" on cart page
2. Fill in shipping address:
   - Full Name: John Doe
   - Address: 123 Main St, Apt 4B
   - City: New York
   - State: NY
   - ZIP: 10001
   - Country: United States
   - Phone: +1-555-123-4567
3. Click "Continue to Shipping Method"

**Expected Results:**

- Form validates all required fields
- Error messages appear for invalid fields
- Proceeds to next step on valid input

**Error Testing:**

- Leave Full Name empty → Error: "Full name is required"
- Enter invalid phone → Error: "Valid phone number is required"
- Leave Country empty → Error: "Country is required"

### Test 6: Checkout - Shipping Method

**Steps:**

1. Select "Standard Shipping" or "Express Shipping"
2. Optionally add order notes
3. Click "Continue to Payment"

**Expected Results:**

- Shipping method selected
- Order summary updates with correct shipping cost
- Proceeds to payment step

### Test 7: Checkout - Payment

**Steps:**

1. Review order summary
2. Click "Place Order"
3. You'll be redirected to Stripe checkout page

**Expected Results:**

- Stripe checkout page loads
- Order summary matches
- Payment methods available

### Test 8: Complete Stripe Payment

**Steps:**

1. On Stripe checkout page, enter test card:
   - Card Number: 4242 4242 4242 4242
   - Expiry: 12/25
   - CVC: 123
   - Name: Test User
2. Click "Pay"

**Expected Results:**

- Payment processes
- Redirected to `/orders?session_id=...`
- Success message displayed

**Verification:**

```bash
# Check database
SELECT * FROM orders WHERE buyerId = 1 ORDER BY createdAt DESC LIMIT 1;
```

### Test 9: View Orders

**Steps:**

1. Navigate to `/orders`
2. Verify order appears in list
3. Check order status and payment status

**Expected Results:**

- Order listed with order number
- Status shows "pending" or "confirmed"
- Payment status shows "pending" or "completed"
- Order date displayed

### Test 10: View Order Details

**Steps:**

1. On orders page, click "View Details"
2. Verify all order information

**Expected Results:**

- Order detail page loads
- Shows order number, date, status
- Lists all items with quantities and prices
- Shows shipping address
- Shows order summary with breakdown
- Shows payment information

## Webhook Testing

### Test 11: Webhook Signature Verification

**Steps:**

1. Use Stripe CLI to forward webhooks:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
2. Complete a test payment

**Expected Results:**

- Webhook received and processed
- Order status updated to "confirmed"
- Payment status updated to "completed"
- No signature verification errors in logs

**Verification:**

```bash
# Check database
SELECT paymentStatus, status FROM orders WHERE id = 1;
```

### Test 12: Webhook Event Handling

**Steps:**

1. Trigger webhook events via Stripe CLI:
   ```bash
   stripe trigger charge.failed
   stripe trigger charge.refunded
   ```

**Expected Results:**

- Events processed correctly
- Order status updated appropriately
- Notifications created in database

**Verification:**

```bash
# Check notifications
SELECT * FROM notifications WHERE userId = 1 ORDER BY createdAt DESC;
```

## Email Testing

### Test 13: Order Confirmation Email

**Steps:**

1. Complete a full checkout flow
2. Check email inbox for confirmation

**Expected Results:**

- Email received at buyer's email address
- Subject: "Order Confirmation - ORD-XXXXXXXX"
- Contains:
  - Order number and date
  - List of items with quantities and prices
  - Order summary (subtotal, shipping, tax, total)
  - Shipping address
  - Professional HTML formatting

**Email Content Verification:**

- Order number matches database
- Total amount matches order total
- Items match cart items
- Shipping address matches input

### Test 14: Payment Failed Email

**Steps:**

1. Trigger a failed payment webhook
2. Check email inbox

**Expected Results:**

- Email received
- Subject: "Payment Failed - Order ORD-XXXXXXXX"
- Contains failure reason
- Includes retry instructions

## Performance Testing

### Test 15: Cart Performance

**Steps:**

1. Add 50+ items to cart
2. Navigate to cart page
3. Measure load time

**Expected Results:**

- Cart page loads in < 2 seconds
- All items displayed correctly
- Quantity updates are responsive

### Test 16: Checkout Performance

**Steps:**

1. Complete checkout with 20+ items
2. Measure time to create Stripe session

**Expected Results:**

- Stripe session created in < 3 seconds
- Redirect to Stripe happens smoothly
- No timeout errors

## Error Scenario Testing

### Test 17: Empty Cart Checkout

**Steps:**

1. Clear cart
2. Navigate to `/checkout`

**Expected Results:**

- Empty cart message displayed
- "Continue Shopping" button available
- Cannot proceed to checkout

### Test 18: Invalid Shipping Address

**Steps:**

1. On checkout, leave required fields empty
2. Try to proceed

**Expected Results:**

- Error messages displayed for each empty field
- Cannot proceed to next step
- Form remains on current step

### Test 19: Network Error During Checkout

**Steps:**

1. Open DevTools Network tab
2. Throttle to "Offline"
3. Try to complete checkout

**Expected Results:**

- Error toast notification displayed
- User stays on checkout page
- Can retry after connection restored

### Test 20: Duplicate Order Prevention

**Steps:**

1. Complete payment
2. Quickly refresh page or go back
3. Verify no duplicate order created

**Expected Results:**

- Only one order created in database
- Webhook idempotency prevents duplicates

**Verification:**

```bash
# Check for duplicate orders
SELECT orderNumber, COUNT(*) as count FROM orders
GROUP BY orderNumber HAVING count > 1;
```

## Database Verification Queries

### Check Cart Items

```sql
SELECT ci.*, p.name, p.basePrice
FROM cart_items ci
JOIN products p ON ci.productId = p.id
WHERE ci.userId = 1;
```

### Check Orders

```sql
SELECT * FROM orders
WHERE buyerId = 1
ORDER BY createdAt DESC;
```

### Check Order Items

```sql
SELECT * FROM orders
WHERE id = 1 \G
```

### Check Notifications

```sql
SELECT * FROM notifications
WHERE userId = 1
ORDER BY createdAt DESC;
```

### Check Stripe Payment Intent IDs

```sql
SELECT orderNumber, stripePaymentIntentId, paymentStatus
FROM orders
WHERE buyerId = 1;
```

## Stripe Dashboard Verification

1. Log in to Stripe Dashboard
2. Navigate to Payments section
3. Find test payment
4. Verify:
   - Amount matches order total
   - Customer email matches
   - Metadata contains user_id and factory_id
   - Status shows "Succeeded"

## Logs to Monitor

### Server Logs

```bash
# Watch for cart operations
grep -i "cart" server.log

# Watch for checkout operations
grep -i "checkout" server.log

# Watch for Stripe operations
grep -i "stripe" server.log

# Watch for email operations
grep -i "email" server.log
```

### Stripe Webhook Logs

```bash
# View webhook attempts
stripe logs tail --filter-level=debug
```

## Cleanup After Testing

### Clear Test Data

```sql
-- Delete test orders
DELETE FROM orders WHERE buyerId = 1;

-- Delete test cart items
DELETE FROM cart_items WHERE userId = 1;

-- Delete test notifications
DELETE FROM notifications WHERE userId = 1;

-- Delete test user
DELETE FROM users WHERE openId = 'test-user-001';
```

## Troubleshooting

### Issue: Webhook not received

**Solution:**

1. Verify webhook secret is correct
2. Check Stripe CLI is running
3. Verify endpoint URL is correct
4. Check server logs for errors

### Issue: Email not sent

**Solution:**

1. Verify EMAIL_USER and EMAIL_PASSWORD are correct
2. Check Gmail app password is generated
3. Verify EMAIL_FROM is set
4. Check server logs for email errors

### Issue: Order not created

**Solution:**

1. Verify user is authenticated
2. Check cart has items
3. Verify database connection
4. Check server logs for errors

### Issue: Cart not persisting

**Solution:**

1. Verify user is authenticated
2. Check database connection
3. Verify userId is correct
4. Check browser console for errors

## Success Criteria

All tests should pass with the following criteria:

- ✅ Cart items persist across page refreshes
- ✅ Checkout form validates all required fields
- ✅ Stripe payment processes successfully
- ✅ Order created in database with correct status
- ✅ Confirmation email sent
- ✅ Order appears in /orders page
- ✅ Order details page shows all information
- ✅ Webhook updates order status correctly
- ✅ No duplicate orders created
- ✅ Error handling works gracefully
