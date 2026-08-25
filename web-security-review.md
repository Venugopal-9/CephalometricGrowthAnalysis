# CephGrow AI — Web Frontend Security Review

**Audit Score**: 72 / 100 (Low Risk)  
**Total Findings**: 14  
**Severity Breakdown**: 0 Critical | 0 High | 0 Medium | 14 Low  

---

## Detailed Audit Findings


### [SEC-WEB-001] Unencrypted Auth Token Storage in localStorage
- **Severity**: `Low` | **Category**: Client Data Security
- **File**: `frontend/src/context/AuthContext.tsx`
- **Impact**: Session persistence without encryption could allow XSS scripts to access local tokens.
- **Remediation**: Migrate session tokens to HttpOnly, SameSite=Strict cookies.


### [SEC-WEB-002] Missing Content Security Policy (CSP) Meta Tag
- **Severity**: `Low` | **Category**: Browser Security
- **File**: `frontend/index.html`
- **Impact**: Without CSP headers, unauthorized script sources could be loaded by malicious extensions.
- **Remediation**: Add `<meta http-equiv="Content-Security-Policy" content="...">` to index.html.


### [SEC-WEB-003] Client-Side Session TTL Timeout Omission
- **Severity**: `Low` | **Category**: Session Management
- **File**: `frontend/src/context/AuthContext.tsx`
- **Impact**: Inactive clinician browser tabs remain authenticated indefinitely.
- **Remediation**: Implement 15-minute idle inactivity auto-logout listener in AuthContext.


### [SEC-WEB-004] Hardcoded Fallback API Endpoint URL
- **Severity**: `Low` | **Category**: Configuration
- **File**: `frontend/src/App.tsx`
- **Impact**: Defaulting to localhost API URL if env var is missing may expose local development endpoints.
- **Remediation**: Strictly enforce VITE_API_URL environment variable check during build.


### [SEC-WEB-005] Missing X-Frame-Options Header Meta Directive
- **Severity**: `Low` | **Category**: Clickjacking Protection
- **File**: `frontend/index.html`
- **Impact**: Frontend web application could potentially be embedded in an malicious iframe.
- **Remediation**: Set frame-ancestors directive in CSP or inject X-Frame-Options DENY header.


### [SEC-WEB-006] Patient Demo PII Stored in Unencrypted Browser Cache
- **Severity**: `Low` | **Category**: Data Privacy
- **File**: `frontend/src/pages/Upload.tsx`
- **Impact**: Patient X-ray case metadata cached in localStorage remains in cleartext.
- **Remediation**: Encrypt offline cache payload using Web Crypto API AES-GCM before caching.


### [SEC-WEB-007] Missing Subresource Integrity (SRI) for Fonts
- **Severity**: `Low` | **Category**: Asset Integrity
- **File**: `frontend/index.html`
- **Impact**: Third-party CDN fonts loaded without SRI hashes risk CDN compromise.
- **Remediation**: Add integrity cryptographic hash attributes to Google Font links.


### [SEC-WEB-008] Verbose Debug Logging in Production JS Bundle
- **Severity**: `Low` | **Category**: Information Disclosure
- **File**: `frontend/vite.config.ts`
- **Impact**: Console warning logs retain full API error stack traces in production environment.
- **Remediation**: Strip console.log and console.debug calls during Vite production bundle build.


### [SEC-WEB-009] Unvalidated Navigation Query Parameter Redirect
- **Severity**: `Low` | **Category**: Input Validation
- **File**: `frontend/src/pages/Login.tsx`
- **Impact**: Login returnUrl parameter does not restrict external protocol prefixes.
- **Remediation**: Sanitize redirect path to ensure it starts strictly with a single forward slash.


### [SEC-WEB-10] Missing Referrer-Policy Meta Tag
- **Severity**: `Low` | **Category**: Privacy Disclosure
- **File**: `frontend/index.html`
- **Impact**: Full URL paths containing patient case IDs might be leaked in HTTP Referer headers.
- **Remediation**: Add `<meta name="referrer" content="strict-origin-when-cross-origin">`.


### [SEC-WEB-011] Feature Policy / Permissions Policy Omission
- **Severity**: `Low` | **Category**: Browser Security
- **File**: `frontend/index.html`
- **Impact**: Unused browser APIs (camera, geolocation, microphone) remain unrestricted.
- **Remediation**: Configure Permissions-Policy header disallowing unused device interfaces.


### [SEC-WEB-012] Potential XSS Risk in Raw InnerHTML / Canvas Overlays
- **Severity**: `Low` | **Category**: Code Injection
- **File**: `frontend/src/components/CephCanvas.tsx`
- **Impact**: Custom SVG canvas annotation labels rendered without explicit HTML escaping.
- **Remediation**: Sanitize patient label strings using DOMPurify before canvas text rendering.


### [SEC-WEB-013] Indirect DevDependency Outdated Version Warnings
- **Severity**: `Low` | **Category**: Dependency Risk
- **File**: `frontend/package.json`
- **Impact**: Transitive build dependencies contain low-severity advisory notices in npm audit.
- **Remediation**: Run npm audit fix to upgrade nested transitive package versions.


### [SEC-WEB-014] Missing Automatic Form Autocomplete Off Attribute
- **Severity**: `Low` | **Category**: Form Security
- **File**: `frontend/src/pages/Signup.tsx`
- **Impact**: Sensitive clinical password input fields allow browser auto-fill cache.
- **Remediation**: Set `autocomplete="current-password"` or `autocomplete="new-password"` explicitly.


---
*Report generated by CephGrow AI SAST Auditor*
