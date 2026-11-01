---
title: Semantic Versioning, Release & Schema Evolution Rules
trigger: model_decision
description: "Mandatory rules and standards for Semantic Versioning (SemVer 2.0.0), Git release tagging, package.json synchronization, PWA cache busting, and Firestore schema migrations."
always_on: true
---

# Semantic Versioning, Release & Schema Evolution Standards

This rule governs application versioning, Git commit and release tagging conventions, client-side cache busting, and persistent database schema migrations across the codebase.

---

## 1. Semantic Versioning Specification (SemVer 2.0.0)

Every application, package, and component release MUST follow **SemVer 2.0.0** (`vMAJOR.MINOR.PATCH`):

| Level | Increment | Trigger Conditions | Examples |
| :--- | :--- | :--- | :--- |
| **MAJOR** | `X.0.0` | Breaking API changes, non-backward-compatible database schema alterations, deprecation removals, fundamental architectural rewrites. | Breaking Firestore order schema from flat to nested without adapter, migrating major router/framework. |
| **MINOR** | `0.X.0` | New backward-compatible capabilities, new locales/languages (e.g. Bahasa Malaysia i18n), additive non-breaking database fields, new UI pages or modal flows. | Adding interactive language selector, adding SGD/USD currency toggle, adding new fragrance discovery quiz. |
| **PATCH** | `0.0.X` | Backward-compatible bug fixes, copy/translation corrections, CSS layout refinements, performance tweaks, security patches, patch dependency updates. | Fixing mobile touch target padding, updating WhatsApp link encoding, resolving hydration or re-render bottlenecks. |

---

## 2. Synchronized Single Source of Truth

When bumping the application version, all corresponding version references MUST be updated simultaneously in the same atomic commit:

1. **`package.json`**: `"version": "X.Y.Z"` must be the authoritative source of truth.
2. **PWA Service Worker (`sw.js`)**: Cache bucket identifier must mirror the version:
   ```javascript
   const CACHE_NAME = 'dlab-nightmatch-vX.Y.Z';
   ```
3. **Web Manifest (`manifest.json`)**: If version metadata is declared, keep in sync with `package.json`.
4. **App Metadata / Footer**: Where the storefront or admin UI displays version credentials or build numbers, consume from build environment or synchronized constant.

---

## 3. Git Release Tagging & Conventional Commits

### Commit Message Structure
All commits MUST follow the Conventional Commits specification:
```text
<type>(<scope>): <short imperative description>

[optional longer body detailing motivation and changes]
```

Standard types:
- `feat`: New user-facing feature or capability
- `fix`: Bug fix
- `perf`: Performance improvement
- `i18n`: Internationalization, localization, translation updates
- `refactor`: Code reorganization without functional behavior change
- `style`: Visual styling, theme tokens, typography, layout
- `test`: Adding or updating test suites
- `chore`: Version bumps, dependency updates, configuration adjustments
- `docs`: Documentation, README, or architecture rule updates

### Release Tagging
Every deployment to staging or production must have an annotated Git tag:
```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z: <Summary of Key Features & Fixes>"
git push origin vX.Y.Z
```

---

## 4. Persistent Database & Firestore Schema Versioning

To ensure zero-downtime deployments and prevent client crashes during progressive web app rollout:

1. **Explicit Schema Version**: Every persisted document entity (orders, user profiles, inventory, review submissions) must include a top-level integer field:
   ```typescript
   schemaVersion: 1
   ```
2. **Backward-Compatible Schema Additions**:
   - New document fields must always be optional (`field?: string`) or supply a safe default value.
   - Client code must never assume newly introduced fields exist on historic documents.
3. **Breaking Schema Changes**:
   - Increment `schemaVersion` (e.g. `1` -> `2`).
   - Implement read adapters that translate legacy schema records into the current schema representation at ingestion time.
   - Run a migration script to backfill legacy documents before removing the adapter.

---

## 5. PWA & Client Cache-Busting Protocol

To prevent clients from executing stale cached bundles after deployment:

1. **Service Worker Activation**: The `activate` event in `sw.js` must delete all stale cache keys:
   ```javascript
   self.addEventListener('activate', (event) => {
     event.waitUntil(
       caches.keys().then((keys) =>
         Promise.all(
           keys
             .filter((key) => key !== CACHE_NAME)
             .map((key) => caches.delete(key))
         )
       )
     );
     self.clients.claim();
   });
   ```
2. **HTML & Manifest Headers**: Firebase Hosting or HTTP web servers must serve `index.html` and `sw.js` with:
   ```http
   Cache-Control: no-cache, no-store, must-revalidate
   ```
   Hashed assets (`/assets/*.js`, `/assets/*.css`) can be cached with long immutable TTLs.

---

## 6. Pre-Release Verification Checklist

Never bump a version or push a release tag without passing the pre-flight verification gate:
1. `npm test`: 100% of unit, logic, and i18n tests passing.
2. `npm run lint` / `tsc --noEmit`: 0 TypeScript compilation errors.
3. `npm run build`: Production asset compilation finishes cleanly without bundle warnings.
