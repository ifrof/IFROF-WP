# IFROF API Documentation

## Overview

This document provides comprehensive documentation for the IFROF platform API endpoints.

**Base URL:** `https://ifrof.com/api`

**Authentication:** Bearer token or session cookie

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Products](#products)
4. [Orders](#orders)
5. [Factories](#factories)
6. [Payments](#payments)
7. [Webhooks](#webhooks)

---

## Authentication

### POST /auth/login

Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "buyer"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "buyer"
  }
}
```

### POST /auth/signup

Register a new user account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "buyer"
}
```

### POST /auth/logout

Logout current user.

---

## Users

### GET /users/me

Get current user profile.

### PUT /users/me

Update current user profile.

### POST /users/block

Block a user.

### POST /users/report

Report a user.

---

## Products

### GET /products

List all products with filters.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `category`: Filter by category
- `search`: Search query

### GET /products/:id

Get product details by ID.

### POST /products

Create a new product (factory only).

### PUT /products/:id

Update product (factory only).

### DELETE /products/:id

Delete product (factory only).

---

## Orders

### GET /orders

List user orders.

### GET /orders/:id

Get order details.

### POST /orders

Create a new order.

### PUT /orders/:id/status

Update order status (admin/factory only).

### GET /orders/:id/tracking

Get order tracking information.

---

## Factories

### GET /factories

List all verified factories.

### GET /factories/:id

Get factory details.

### POST /factories

Register a new factory.

### PUT /factories/:id

Update factory information.

---

## Payments

### POST /payments/create-checkout

Create Stripe checkout session.

### POST /payments/webhook

Stripe webhook endpoint (internal use only).

---

## Webhooks

### POST /webhooks/stripe

Handle Stripe webhook events.

**Supported Events:**
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.failed`
- `charge.refunded`

---

## Rate Limits

- **General API:** 100 requests per 15 minutes
- **Authentication:** 5 requests per 15 minutes
- **Strict endpoints:** 10 requests per minute

## Error Codes

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## Currency Support

Supported currencies:
- **USD** (Primary)
- **SAR** (Saudi Riyal)
- **CNY** (Chinese Yuan)

Exchange rates are updated automatically.

---

*Last updated: January 2026*
