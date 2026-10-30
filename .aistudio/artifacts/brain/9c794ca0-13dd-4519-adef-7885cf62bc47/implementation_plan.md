# DLAB Night Match — Shop & Product Management Admin Console

A unified nocturnal atelier administration portal accessible directly from the main navigation bar, empowering store operators to create, edit, and remove fragrance extraits, configure bottle size pricing, manage global shop settings and WhatsApp checkout routing, and maintain promo codes and complimentary miniature samples—persisted in real time via Firebase Firestore and Google Authentication.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX decisions incorporate your confirmed preferences before implementation begins:

- **Confirmed Scope**: Full product catalog and multi-size pricing CRUD (`10ml`, `30ml`, `40ml`), global shop configuration (WhatsApp dispatch number, free shipping threshold, standard shipping fee, monogramming fee, top banner announcement), and promotional management (discount promo codes and 2ml complimentary sample inventory).
- **Confirmed Persistence Strategy**: Firebase Firestore cloud database paired with Google Authentication (`signInWithPopup`) so catalog changes, pricing updates, and shop settings synchronize across all client sessions in real time, with automatic initial catalog seeding from the default DLAB archive when the database is empty.
- **Confirmed Access Model**: Open navigation access directly from the top navigation bar (`Admin` tab) so you can immediately open and inspect the management console at any time, paired with a one-click Google Sign-In bar inside the console to authorize live cloud writes under hardened Firestore security rules.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the static fragrance catalog and hardcoded checkout parameters into a live, database-backed commerce system managed through a dedicated Admin Console view. Storefront visitors immediately see updated products, prices, complimentary sample options, promo codes, and WhatsApp order routing across the 10-Second Assessment Quiz, 30-Day Leaderboard, Catalog Grid, and Quick Bag Drawer.
- **Target Audience / Persona**: DLAB Atelier store managers and merchandisers who need a fast, structured interface to launch new fragrance batches, adjust bottle pricing, toggle stock status, or update the WhatsApp concierge phone number without touching code.
- **Key Value**: Eliminates hardcoded catalog bottlenecks while preserving the high-contrast nocturnal luxury aesthetic (`#0F0E0D` obsidian canvas, `#1E1C1A` structural containers, `#D4AF37` gold accents, and tabular numeric discipline).

---

## 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Direct Navigation Entry**: Clicking the **Admin** link in the main navigation bar switches the viewport to the Atelier Admin Console with three sub-navigation workspaces: *Products & Pricing*, *Shop & WhatsApp Settings*, and *Promotions & Samples*.
  2. **Cloud Auth & Sync Bar**: A clean header bar displays current synchronization status and a Google Sign-In button (`aliakhmadf@gmail.com` bootstrapped as verified administrator) to unlock cloud write operations, plus a one-click **Seed / Reset Default Catalog** utility.
  3. **Product Catalog & Multi-Size Pricing CRUD**:
     - High-density tabular product ledger showing code (`NO.01`, `NO.06 C4`), fragrance name, intensity level, preferred experience, 10ml/30ml/40ml pricing in tabular numerals, stock status toggle, and quick actions (*Edit*, *Duplicate*, *Delete*).
     - Slide-over or modal **Flacon Editor** with structured sections for core identity, intensity & experience selectors, 3-tier volume pricing (`10ml`, `30ml`, `40ml`), olfactory pyramid notes (Top, Heart, Base), accord percentages, safety instructions, and image URLs with live card preview.
  4. **Global Shop & WhatsApp Settings**:
     - Form controls for the primary WhatsApp dispatch number (used across all single-item and multi-item `wa.me` links), free shipping threshold, standard shipping fee, bespoke monogram fee, and top announcement banner text.
  5. **Promo Codes & Complimentary Samples**:
     - Interactive manager to add, toggle, or delete percentage promo codes (e.g., `NOCTURNE10`, `HAUTE15`, `VIPATELIER`) and curate the 2ml complimentary sample vials offered in the Quick Bag drawer.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Utilitarian nocturnal luxury console—combining high-density SaaS data table precision with the DLAB obsidian-and-gold visual language.
  - *Color Palette & Mood*:
    - Dominant Canvas (`60%`): Deep Obsidian (`#0F0E0D`) and Dark Charcoal (`#151311`).
    - Structural Surfaces (`30%`): Matte Surface Dark (`#1E1C1A`) with `1px` hairline borders (`#4b4640/50`) and muted bone text (`#cdc5bd`).
    - Accent Budget (`10%`): Luminous Neon Gold (`#D4AF37`) for primary save actions and active tabs; semantic status pairings with text labels (`In Stock` in emerald, `Out of Stock` in rose).
  - *Typography & Hierarchy*: Crisp geometric sans display and body hierarchy paired with strict monospace tabular numerals (`font-mono tabular-nums`) for all prices, percentages, batch counts, and order ranks.
  - *Component Styling & Layout*: Single-elevation flat surfaces with `0.25rem` architectural corners, compact `40px` table row heights, left-aligned text columns, and right-aligned numeric columns.

- **Interactive Feedback & Motion**:
  - Instant optimistic UI updates backed by Firestore `onSnapshot` listeners, subtle row hover highlights, inline validation feedback, and confirmation modals before destructive product deletions.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Live Firestore Sync with Automatic Fallback & Seeding**
  - *Chosen Approach*: Store products, shop settings, promo codes, and complimentary samples in Firestore collections (`products`, `shopSettings`, `promoCodes`, `samples`). While Firestore initializes or if the database has not been seeded yet, the storefront seamlessly falls back to the initial 6 DLAB extraits so the storefront never appears blank.
  - *Why*: Ensures zero downtime for shoppers while giving the admin full cloud persistence once signed in.
  - *Alternatives Considered*: Pure `localStorage` was passed over because edits would only apply to a single browser rather than persisting across devices.

- **Decision 2: Open Console Access Paired with Verified Admin Write Rules**
  - *Chosen Approach*: Allow anyone to open the Admin view directly from the navigation bar (`allow read: if true` on public catalog and shop configuration collections), while enforcing authenticated admin verification (`request.auth.token.email == 'aliakhmadf@gmail.com'` or `/admins/{uid}`) on Firestore `create`, `update`, and `delete` operations.
  - *Why*: Satisfies frictionless navigation bar access while protecting the cloud database against unauthorized mutations in accordance with zero-trust Firestore security principles.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        Firebase Cloud Persistence                        │
│  ┌──────────────┐  ┌────────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │  /products   │  │ /shopSettings  │  │ /promoCodes  │  │  /samples  │  │
│  └──────┬───────┘  └───────┬────────┘  └──────┬───────┘  └─────┬──────┘  │
└─────────┼──────────────────┼──────────────────┼────────────────┼─────────┘
          │                  │   onSnapshot     │                │
          ▼                  ▼                  ▼                ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                 ShopDataContext (Real-Time State & CRUD)                 │
│     • Live catalog array, WhatsApp phone, shipping/monogram fees         │
│     • Admin auth state (Google Sign-In) & initial catalog seeder         │
└───────────────────┬──────────────────────────────────┬───────────────────┘
                    │                                  │
                    ▼                                  ▼
┌──────────────────────────────────────┐  ┌────────────────────────────────┐
│       Public Storefront Views        │  │     Atelier Admin Console      │
│  ┌────────────────────────────────┐  │  │  ┌──────────────────────────┐  │
│  │ 10-Second Direct Assessment    │  │  │  │ Product & Pricing Table  │  │
│  ├────────────────────────────────┤  │  │  ├──────────────────────────┤  │
│  │ Live 30-Day Leaderboard        │  │  │  │ Slide-Over Flacon Editor │  │
│  ├────────────────────────────────┤  │  │  ├──────────────────────────┤  │
│  │ Catalog Grid & Aroma Modal     │  │  │  │ Shop & WhatsApp Settings │  │
│  ├────────────────────────────────┤  │  │  ├──────────────────────────┤  │
│  │ Quick Bag & WhatsApp Checkout  │  │  │  │ Promo & Sample Manager   │  │
│  └────────────────────────────────┘  │  │  └──────────────────────────┘  │
└──────────────────────────────────────┘  └────────────────────────────────┘
```

- **Data Model & State**:
  - **Product (`products/{productId}`)**: `id`, `shortCode`, `code`, `name`, `subtitle`, `price`, `sizes` (`10ml`, `30ml`, `40ml` price objects), `intensity` (`Mild` | `Strong` | `Intense`), `experience` (`Relaxing` | `High-energy` | `Sensual` | `Velvet Focus`), `concentration`, `harvestYear`, `perfumer`, `batchCount`, `monthlyOrders`, `rank`, `trendingDelta`, `description`, `poeticQuote`, `primaryImage`, `secondaryImage`, `boxImage`, `notes` (`top`, `heart`, `base`), `accords`, `safetyInstructions`, `sillage`, `longevityHours`, `optimalHours`, `scentFamilies`, `featured`, `bestseller`, `inStock`.
  - **Shop Settings (`shopSettings/global`)**: `whatsappPhone`, `freeShippingThreshold`, `standardShippingFee`, `monogramPrice`, `announcementText`.
  - **Promo Codes (`promoCodes/{codeId}`)**: `code` (uppercase identifier), `discountPercent` (1–90), `active` (boolean), `description`.
  - **Complimentary Samples (`samples/{sampleId}`)**: `id`, `name`, `family`, `active` (boolean).

- **Interactive Component & State Mapping**:
  - **Catalog CRUD Handlers**: Creating or editing a product validates all required fields and string/array length limits, updates the `products/{id}` document in Firestore, and immediately reflects across the storefront catalog, 10-second quiz matcher, and leaderboard.
  - **Quick Toggles**: Clicking `In Stock / Out of Stock`, `Featured`, or `Rank` steppers in the admin table dispatches an atomic document update. Out-of-stock products display a clear badge and disable checkout actions on the storefront.
  - **Global Settings & WhatsApp Link Propagation**: Saving a new WhatsApp phone number or fee threshold updates `shopSettings/global` and dynamically recalculates all `wa.me` links and Quick Bag totals in real time.
  - **Promo & Sample Handlers**: Adding or toggling promo codes and 2ml samples updates Firestore and immediately syncs with the Quick Bag drawer's promo validator and sample selector.
