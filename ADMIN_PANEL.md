# IFROF Admin Panel Documentation

The IFROF Admin Panel is a comprehensive management system for platform administrators to oversee products, orders, users, and manufacturers.

## Features

### 1. Dashboard Overview
- **Real-time Stats**: Total products, orders, users, and revenue.
- **Recent Activity**: Quick view of the latest 10 orders.
- **Quick Actions**: Direct links to common management tasks.

### 2. Product Management (`/admin/products`)
- **List & Search**: View all products with search functionality.
- **Add/Edit**: Full form for managing product details (name, price, category, etc.).
- **Soft Delete**: Deactivate products without removing them from the database.
- **Bulk Actions**: Placeholder for CSV import/export.

### 3. Order Management (`/admin/orders`)
- **Order Tracking**: View all customer orders with status indicators.
- **Status Updates**: Dropdown to change order status (Pending → Delivered).
- **Filtering**: Filter orders by status.
- **Invoices**: Quick access to order details for invoicing.

### 4. User Management (`/admin/users`)
- **User List**: View all registered users and their roles.
- **Role Management**: Promote users to Admin, Factory, or Buyer roles.
- **Search**: Find users by name or email.

### 5. Factory Management (`/admin/factories`)
- **Verification Flow**: Approve or reject factory applications.
- **Factory Details**: View contact information and location.
- **Filtering**: View pending, verified, or rejected factories.

## Security

- **Role-Based Access Control (RBAC)**: All admin routes and API procedures are protected by `adminProcedure`.
- **Middleware**: Server-side check ensures only users with `role: 'admin'` can access sensitive data or perform mutations.
- **Frontend Protection**: Admin pages check user role and redirect non-admins to the homepage.

## Technical Implementation

- **Backend**: `server/routers/admin.ts` (tRPC router).
- **Frontend**: 
  - `AdminDashboard.tsx`
  - `AdminProducts.tsx`
  - `AdminOrders.tsx`
  - `AdminUsers.tsx`
  - `AdminFactories.tsx`
- **Database**: Drizzle ORM with MySQL.

## How to Access

1. Log in with an account that has the `admin` role.
2. Navigate to `/admin` or `/dashboard/admin`.
