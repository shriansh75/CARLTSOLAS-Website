# Security Policy — CARLTSOLAS Engineering Website

This document describes the security posture and controls for the CARLTSOLAS Engineering website. It follows OWASP best practices.

## Current surface

The site is currently a **static marketing site**: no authentication, no user accounts, no API routes, no database, and no server-side secrets. Contact is via `mailto:` only. The primary attack surface is the public front-end and its delivery.

Consequently, the endpoint controls below (rate limiting, input validation, IDOR) are **implemented as policy and ready-to-apply patterns**: they take effect the moment any dynamic endpoint (for example a contact-form handler / serverless function) is added. The controls that apply **today** are the delivery/hardening ones (security headers, CSP, no source maps, no client-side secrets).

## Reporting a vulnerability

Report suspected vulnerabilities privately to **office@solasmodu.net**. Please do not open public issues for security reports. We aim to acknowledge within a few business days.

## Controls

### 1. Rate limiting (every future public / auth endpoint)
- Rate-limit all public endpoints per **IP** and per **authenticated user**, with sensible defaults and graceful **HTTP 429** responses that include `Retry-After`.
- Authentication routes are capped at **five attempts per 15 minutes** per identifier (IP plus account); further attempts are rejected until the window resets.
- On Cloudflare, also enforce at the edge (WAF / Rate Limiting Rules) in addition to application-level checks.

### 2. Input validation and sanitization (every user input)
- Validate all input with **schema-based validation** (for example Zod): explicit types, length limits, allowed formats, and **rejection of unexpected or extra fields** (strict schemas).
- Reject **oversized** and **malformed** payloads early (body-size limits, content-type checks).
- Sanitize or escape any user-provided content before it is stored or rendered. Never build queries or markup by string concatenation; use parameterized queries and context-aware escaping.

### 3. Secret handling
- **No secrets in source or client bundles.** There are none in this codebase today.
- Store secrets in environment variables / Cloudflare secrets. Never expose them through `NEXT_PUBLIC_*` unless the value is genuinely public.
- Any key that must be used from the browser is proxied through a server function that holds the secret.

### 4. IDOR / access control
- Every request that references a resource by id must **verify server-side that the requester owns, or is authorized for, that resource.** A client-supplied id (for example changing `123` to another user's id) must fail.
- Scope every query by the authenticated principal and prefer non-enumerable identifiers (UUIDs). Deny by default.

## Delivery hardening (in effect now)
- **Security headers** on every response (see `next.config.mjs` `headers()` and `public/_headers`): CSP, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`, HSTS.
- **No source maps** in production (`productionBrowserSourceMaps: false`) and **console stripped** in production, so the shipped JavaScript is minified, mangled, and unreadable in DevTools.
- `X-Powered-By` disabled; framework and version details are not advertised.

## A note on "hiding" client code
Any code delivered to the browser can, in principle, be inspected. We minimize what is exposed (minification, no source maps, no client secrets, no source comments in the bundle, a strict CSP), which stops casual scraping and copy-paste reuse. This is deterrence, not a security control: nothing sensitive ever lives client-side.

## OWASP alignment
This policy maps to the OWASP Top 10 (Broken Access Control, Injection, Security Misconfiguration, Identification and Authentication failures, SSRF, and others).
