# IFROF.COM - QA Test Cases

## Test Environment Setup

```bash
# Prerequisites
npm install
npm run build
npm run dev

# Open browser
open https://localhost:3000
```

---

## Homepage Tests

### TC-001: Page Load & Basic Rendering
**Objective:** Verify homepage loads correctly
**Steps:**
1. Open https://ifrof.com
2. Wait for page to fully load
3. Check for console errors (F12 > Console)

**Expected Results:**
- ✅ Page loads in < 3 seconds
- ✅ No console errors
- ✅ All images load
- ✅ Hero section visible
- ✅ CTA button visible

**Acceptance Criteria:**
- PASS: All elements render, no errors
- FAIL: Console errors, missing elements, slow load

---

### TC-002: Navigation Links
**Objective:** Verify all header navigation links work
**Steps:**
1. Click "Marketplace" link
2. Verify page changes to /marketplace
3. Click "Find Real Factory" link
4. Verify page changes to /search
5. Click "Blog" link
6. Verify page changes to /blog
7. Click "Contact" link
8. Verify page changes to /contact

**Expected Results:**
- ✅ All links navigate correctly
- ✅ URL updates in address bar
- ✅ Page content changes

**Acceptance Criteria:**
- PASS: All 4 links navigate to correct pages
- FAIL: Any link doesn't work or 404 error

---

### TC-003: CTA Button Behavior (Unauthenticated)
**Objective:** Verify CTA shows login prompt when not authenticated
**Steps:**
1. Ensure logged out
2. Click "Find Real Factory Now" button
3. Check for toast notification or redirect

**Expected Results:**
- ✅ Toast notification: "Please log in to search factories"
- ✅ Redirect to /login page OR
- ✅ Login modal appears

**Acceptance Criteria:**
- PASS: User is prompted to login
- FAIL: User can access search without login

---

### TC-004: Dark/Light Mode Toggle
**Objective:** Verify theme switching works
**Steps:**
1. Click light/dark mode toggle button
2. Observe page colors change
3. Refresh page
4. Verify theme persists

**Expected Results:**
- ✅ Page switches to light theme
- ✅ All text remains readable
- ✅ Theme preference saved to localStorage
- ✅ Theme persists after refresh

**Acceptance Criteria:**
- PASS: Theme toggles and persists
- FAIL: Theme doesn't change or doesn't persist

---

### TC-005: Language Switching
**Objective:** Verify language switching works
**Steps:**
1. Click language selector
2. Select "العربية" (Arabic)
3. Verify text changes to Arabic
4. Verify layout switches to RTL
5. Select "English"
6. Verify text changes back to English
7. Verify layout switches to LTR

**Expected Results:**
- ✅ Text translates correctly
- ✅ Layout switches to RTL for Arabic
- ✅ Layout switches to LTR for English
- ✅ All elements remain readable

**Acceptance Criteria:**
- PASS: Language switches correctly with proper RTL/LTR
- FAIL: Text doesn't translate or layout breaks

---

### TC-006: Newsletter Subscription - Valid Email
**Objective:** Verify newsletter subscription works with valid email
**Steps:**
1. Scroll to footer
2. Enter valid email: "test@example.com"
3. Click "Subscribe" button
4. Wait for response

**Expected Results:**
- ✅ Success message appears
- ✅ Email input clears
- ✅ Email added to database

**Acceptance Criteria:**
- PASS: Success message shown, email added
- FAIL: Error message or email not added

---

### TC-007: Newsletter Subscription - Invalid Email
**Objective:** Verify newsletter validation rejects invalid emails
**Steps:**
1. Scroll to footer
2. Enter invalid email: "notanemail"
3. Click "Subscribe" button

**Expected Results:**
- ✅ Error message: "Invalid email address"
- ✅ Email not added to database
- ✅ Input field remains focused

**Acceptance Criteria:**
- PASS: Error shown, email not added
- FAIL: Invalid email accepted

---

### TC-008: Newsletter Subscription - Empty Email
**Objective:** Verify newsletter validation rejects empty input
**Steps:**
1. Scroll to footer
2. Leave email field empty
3. Click "Subscribe" button

**Expected Results:**
- ✅ Error message: "Email is required"
- ✅ Email not added to database

**Acceptance Criteria:**
- PASS: Error shown
- FAIL: Empty email accepted

---

### TC-009: Social Media Links
**Objective:** Verify social media links open correctly
**Steps:**
1. Click Facebook icon
2. Verify Facebook page opens in new tab
3. Go back to homepage
4. Click Twitter icon
5. Verify Twitter page opens in new tab
6. Go back and test LinkedIn and Instagram

**Expected Results:**
- ✅ All links open in new tab
- ✅ Links point to correct social profiles
- ✅ No 404 errors

**Acceptance Criteria:**
- PASS: All 4 social links work
- FAIL: Any link broken or wrong URL

---

### TC-010: Footer Links
**Objective:** Verify all footer links work
**Steps:**
1. Click "About Us" link
2. Verify page changes to /about
3. Click "Privacy Policy" link
4. Verify page changes to /privacy
5. Click "Terms of Service" link
6. Verify page changes to /terms

**Expected Results:**
- ✅ All links navigate correctly
- ✅ No 404 errors
- ✅ Content loads properly

**Acceptance Criteria:**
- PASS: All footer links work
- FAIL: Any link broken or 404

---

## Marketplace Page Tests

### TC-011: Marketplace Empty State
**Objective:** Verify empty state messaging
**Steps:**
1. Navigate to /marketplace
2. Observe factories list

**Expected Results:**
- ✅ Message: "No factories found"
- ✅ Clear call-to-action: "Search Factories" button
- ✅ Search input visible

**Acceptance Criteria:**
- PASS: Clear empty state with CTA
- FAIL: Confusing message or no CTA

---

### TC-012: Search Functionality
**Objective:** Verify search works
**Steps:**
1. Navigate to /marketplace
2. Enter search term: "electronics"
3. Click search button
4. Wait for results

**Expected Results:**
- ✅ Search results load
- ✅ Results match search term
- ✅ Loading state shown while searching

**Acceptance Criteria:**
- PASS: Relevant results shown
- FAIL: No results or irrelevant results

---

## Authentication Tests

### TC-013: Login Page Load
**Objective:** Verify login page loads correctly
**Steps:**
1. Navigate to /login
2. Check for login form

**Expected Results:**
- ✅ Login form visible
- ✅ Email and password fields present
- ✅ "Sign Up" link present
- ✅ "Forgot Password" link present

**Acceptance Criteria:**
- PASS: All form elements visible
- FAIL: Missing form fields

---

### TC-014: Login with Invalid Credentials
**Objective:** Verify login rejects invalid credentials
**Steps:**
1. Navigate to /login
2. Enter email: "test@example.com"
3. Enter password: "wrongpassword"
4. Click "Sign In"

**Expected Results:**
- ✅ Error message: "Invalid email or password"
- ✅ User not logged in
- ✅ Page remains on /login

**Acceptance Criteria:**
- PASS: Error shown, user not logged in
- FAIL: User logged in with wrong credentials

---

## Performance Tests

### TC-015: Page Load Time
**Objective:** Verify page load performance
**Steps:**
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check load time

**Expected Results:**
- ✅ TTFB < 100ms
- ✅ Full page load < 3s
- ✅ LCP < 2.5s

**Acceptance Criteria:**
- PASS: All metrics within targets
- FAIL: Any metric exceeds target

---

### TC-016: Bundle Size
**Objective:** Verify bundle size is optimized
**Steps:**
1. Build project: `npm run build`
2. Check dist folder size
3. Check individual chunk sizes

**Expected Results:**
- ✅ Main bundle < 500KB
- ✅ Total dist < 2MB
- ✅ No unused dependencies

**Acceptance Criteria:**
- PASS: Bundle size within limits
- FAIL: Bundle too large

---

## Accessibility Tests

### TC-017: Keyboard Navigation
**Objective:** Verify all interactive elements are keyboard accessible
**Steps:**
1. Press Tab key repeatedly
2. Verify focus indicator visible
3. Press Enter on buttons
4. Verify actions work

**Expected Results:**
- ✅ All buttons/links focusable
- ✅ Focus indicator clearly visible
- ✅ Enter key activates buttons

**Acceptance Criteria:**
- PASS: Full keyboard navigation works
- FAIL: Any element not keyboard accessible

---

### TC-018: Color Contrast
**Objective:** Verify text contrast meets WCAG standards
**Steps:**
1. Use axe DevTools extension
2. Run accessibility audit
3. Check color contrast results

**Expected Results:**
- ✅ All text WCAG AA compliant
- ✅ No low contrast warnings

**Acceptance Criteria:**
- PASS: All text meets WCAG AA
- FAIL: Any contrast issue found

---

### TC-019: Screen Reader Compatibility
**Objective:** Verify page works with screen readers
**Steps:**
1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate page
3. Verify all content is readable
4. Verify form labels are announced

**Expected Results:**
- ✅ All content announced correctly
- ✅ Form labels associated with inputs
- ✅ Buttons announced with purpose

**Acceptance Criteria:**
- PASS: Screen reader can navigate page
- FAIL: Content not announced or confusing

---

## Mobile Tests

### TC-020: Mobile Responsiveness
**Objective:** Verify page works on mobile devices
**Steps:**
1. Open DevTools
2. Enable device emulation
3. Test on iPhone 12 (390x844)
4. Test on Samsung Galaxy S21 (360x800)
5. Verify layout and functionality

**Expected Results:**
- ✅ Layout adapts to screen size
- ✅ All buttons clickable
- ✅ Text readable without zoom
- ✅ No horizontal scrolling

**Acceptance Criteria:**
- PASS: Works on all tested devices
- FAIL: Layout breaks or elements not clickable

---

### TC-021: Mobile Menu
**Objective:** Verify mobile hamburger menu works
**Steps:**
1. Open on mobile device
2. Click hamburger menu icon
3. Verify menu opens
4. Click menu item
5. Verify menu closes and navigation works

**Expected Results:**
- ✅ Menu icon visible on mobile
- ✅ Menu opens/closes smoothly
- ✅ Navigation works from menu

**Acceptance Criteria:**
- PASS: Mobile menu fully functional
- FAIL: Menu doesn't open or navigation broken

---

## Security Tests

### TC-022: Security Headers
**Objective:** Verify security headers are present
**Steps:**
1. Open DevTools
2. Go to Network tab
3. Click on main document request
4. Check Response Headers

**Expected Results:**
- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ Content-Security-Policy present
- ✅ Strict-Transport-Security present

**Acceptance Criteria:**
- PASS: All security headers present
- FAIL: Any security header missing

---

### TC-023: HTTPS Enforcement
**Objective:** Verify HTTPS is enforced
**Steps:**
1. Try to access http://ifrof.com
2. Verify redirect to https://ifrof.com

**Expected Results:**
- ✅ HTTP redirects to HTTPS
- ✅ No mixed content warnings

**Acceptance Criteria:**
- PASS: HTTPS enforced
- FAIL: HTTP accessible or mixed content

---

## Test Execution Checklist

```
[ ] TC-001: Page Load & Basic Rendering
[ ] TC-002: Navigation Links
[ ] TC-003: CTA Button Behavior
[ ] TC-004: Dark/Light Mode Toggle
[ ] TC-005: Language Switching
[ ] TC-006: Newsletter - Valid Email
[ ] TC-007: Newsletter - Invalid Email
[ ] TC-008: Newsletter - Empty Email
[ ] TC-009: Social Media Links
[ ] TC-010: Footer Links
[ ] TC-011: Marketplace Empty State
[ ] TC-012: Search Functionality
[ ] TC-013: Login Page Load
[ ] TC-014: Login Invalid Credentials
[ ] TC-015: Page Load Time
[ ] TC-016: Bundle Size
[ ] TC-017: Keyboard Navigation
[ ] TC-018: Color Contrast
[ ] TC-019: Screen Reader Compatibility
[ ] TC-020: Mobile Responsiveness
[ ] TC-021: Mobile Menu
[ ] TC-022: Security Headers
[ ] TC-023: HTTPS Enforcement
```

---

## Regression Test Suite

Run before each release:

```bash
# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Accessibility audit
npx axe-core https://ifrof.com

# Performance audit
npx lighthouse https://ifrof.com

# Security scan
npx snyk test
```

---

**Test Plan Version:** 1.0  
**Last Updated:** 26 Jan 2026  
**Status:** Ready for Execution
