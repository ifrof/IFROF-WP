# IFROF User System (Phase 4)

This document outlines the complete user authentication and management system implemented for IFROF.COM.

## Features

### 1. Registration (`/register`)

- Full validation for email, password strength, and name.
- Password hashing using `bcrypt` (10 salt rounds).
- Unique email enforcement.
- Automatic email verification token generation.
- Integration with `email-service.ts` to send verification links.
- Automatic login after successful registration.

### 2. Email Verification (`/verify-email/[token]`)

- JWT-based verification tokens (24h expiry).
- Secure status update in database.
- User-friendly success/error states.

### 3. Login (`/login`)

- Secure credential validation.
- Email verification check (blocks unverified users).
- "Remember Me" support (30-day vs 7-day sessions).
- HTTP-only cookie storage for JWT session tokens.
- CSRF protection integrated.

### 4. Password Reset (`/forgot-password` & `/reset-password/[token]`)

- Secure token generation (1h expiry).
- Email delivery of reset links.
- Password strength validation on reset.
- Invalidation of tokens after use.

### 5. User Profile (`/profile`)

- Tabbed interface: Profile Details, Order History, Security.
- Real-time profile updates (name, phone).
- Secure password change functionality.
- Integrated order history from the payments system.

### 6. Session Management

- Custom JWT implementation integrated with existing OAuth SDK.
- Support for both local email/password users and OAuth users.
- Automatic session persistence across browser restarts.

## Technical Implementation

### Backend

- **Router**: `server/routers/auth-complete.ts` (tRPC)
- **Database**: Updated `drizzle/schema.ts` with auth fields.
- **SDK**: Enhanced `server/_core/sdk.ts` to support dual-auth (OAuth + JWT).
- **Email**: Added templates to `server/_core/email-service.ts`.

### Frontend

- **Pages**: `Register.tsx`, `Login.tsx`, `VerifyEmail.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`, `Profile.tsx`.
- **State**: Managed via tRPC hooks and React Hook Form.
- **Validation**: Zod schemas shared between frontend and backend.

## Environment Variables Required

```env
JWT_SECRET=your_secure_jwt_secret
PUBLIC_URL=https://ifrof.com
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_app_password
```

## Security Measures

- **Password Hashing**: Bcrypt for all local passwords.
- **JWT Security**: Signed tokens with configurable expiration.
- **Cookie Security**: HTTP-only, Secure (in production), SameSite=Lax.
- **Rate Limiting**: Integrated with existing auth rate limiters.
- **Input Sanitization**: All inputs validated via Zod.
