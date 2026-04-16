# Currency Converter Implementation Plan

## Current State

### Completed
- Admin settings now map to storefront runtime behavior.
- Visitor preference save/restore is working.
- Exchange rate frequency is wired from admin settings.
- Secure geolocation flow is implemented through app proxy and server-side API calls.
- Auto-switch exclusion logic and fallback currency flow are implemented.
- Base/original price tracking has been hardened for repeated conversion.
- Clear visitor preferences and reset settings actions are implemented.
- Delete-all-data has been intentionally disabled to avoid metafield-driven app breakage.
- Missing metafields are protected with:
  - admin-side fallback
  - storefront-side guard
  - server-side auto-heal
- Currency status on/off is now a real toggle.
- Dashboard app-embed status now supports enable + verify flows.
- Storefront behavior options now include:
  - currency name on hover
  - original price on hover
  - dark mode support

### Still Not Fully Productized
- Conversion analytics is still placeholder/static.
- Exchange-rate status cards still show fake "last synced" and "next sync" values.
- Some dashboard/admin widgets still use static content instead of store-backed data.
- Storefront analytics events are not yet persisted server-side.

---

## Priority Order

### 1. Conversion Analytics
This should be the next major implementation.

#### Goal
Track real conversion-related usage and show actual numbers in the dashboard.

#### What needs to be tracked
- Sessions this week
- Currency switches
- Last switch time
- Most selected currency
- Auto-detected vs manually selected switches

#### Recommended implementation
1. Add Prisma tables for analytics events.
2. Create a public app-proxy analytics ingestion route.
3. Emit frontend events from the embed script for:
   - widget initialized
   - currency changed manually
   - currency auto-detected
4. Aggregate these events in the dashboard loader.
5. Replace static numbers in [Analytics.jsx](/abs/path/d:/Apps/Office/currency-converter/app/components/essentials/Analytics.jsx) with real metrics.

#### Suggested data model
- `AnalyticsEvent`
  - `id`
  - `shop`
  - `eventType`
  - `currencyCode`
  - `source`
  - `createdAt`
  - optional `metadata`

#### Event types
- `widget_view`
- `currency_switch_manual`
- `currency_switch_auto`

#### Source values
- `manual`
- `auto_detect`
- `fallback`
- `default`
- `restored_preference`

#### Files likely involved
- `prisma/schema.prisma`
- `app/routes/api.*` new analytics route
- `app/routes/app._index.jsx`
- `app/components/essentials/Analytics.jsx`
- `extensions/app-embed/blocks/app-embed.liquid`

---

### 2. Last Sync Time
This is the next focused fix after analytics, or can be built in parallel if desired.

#### Problem today
The exchange-rate cards are hardcoded placeholders in:
- [app/components/pages/settings/general/ExchangeRates.jsx](/abs/path/d:/Apps/Office/currency-converter/app/components/pages/settings/general/ExchangeRates.jsx)
- [app/components/pages/currency/general/ExchangeRates.jsx](/abs/path/d:/Apps/Office/currency-converter/app/components/pages/currency/general/ExchangeRates.jsx)

#### Goal
Show:
- actual last synced time
- sync status based on real storefront-triggered refreshes

#### Recommended implementation
1. Persist exchange-rate metadata somewhere server-side.
2. When rates are fetched, store:
   - last synced timestamp
3. Read that metadata in settings/currency loaders.
4. Replace hardcoded timestamps in admin UI.

#### Best architectural option
Move exchange-rate fetching responsibility to the app backend over time, or at least mirror sync metadata server-side.

#### Short-term workable option
Store exchange sync metadata in a dedicated app metafield, for example:
- `currency_converter.exchange_meta`

Possible shape:
```json
{
  "lastSyncedAt": "2026-04-16T10:30:00.000Z"
}
```

#### Files likely involved
- `app/routes/app.settings.jsx`
- `app/routes/app.currency.jsx`
- `app/components/pages/settings/general/ExchangeRates.jsx`
- `app/components/pages/currency/general/ExchangeRates.jsx`
- possibly a new helper in `app/utils`

---

### 3. Dashboard and Admin Data Polish

#### Goal
Replace remaining placeholders with real app/store data.

#### Targets
- Feature status card in dashboard analytics block
- Active currencies count from real metafields
- Auto-detect status from real metafields
- Currency status badge alignment across pages

#### Files likely involved
- `app/components/essentials/Analytics.jsx`
- `app/routes/app._index.jsx`
- `app/routes/app.currency.jsx`
- `app/routes/app.settings.jsx`

---

### 4. Storefront Event Reliability

#### Goal
Make storefront analytics and conversion state updates more production-safe.

#### Improvements
- Debounce repeated events
- Avoid duplicate analytics on the same selection
- Add robust source tagging for:
  - restored preference
  - detected currency
  - fallback currency
  - manual switch
- Guard against repeated widget initialization on section re-renders

#### Files likely involved
- `extensions/app-embed/blocks/app-embed.liquid`

---

### 5. Nice-to-Have Improvements

These are useful but not urgent.

#### Candidates
- Better empty state after app data deletion or corruption
- More explicit admin feedback banners after reset/clear actions
- Accessibility refinement for hover-based information
- Stronger theme compatibility for more money markup patterns
- Optional custom tooltip UX for original price, if revisited later

---

## Recommended Next Coding Step

If continuing immediately, the best next implementation is:

### Build real conversion analytics first

Why:
- It unlocks the dashboard placeholder section.
- It gives immediate merchant value.
- It creates the data foundation that later reporting can build on.
- It is a cleaner next milestone than polishing static cards first.

After that:

### Build real exchange sync metadata and last-sync UI

Why:
- It removes the last obviously fake operational metrics from admin.
- It makes exchange-rate behavior transparent to merchants.

---

## Proposed Milestones

### Milestone A
- Prisma analytics table
- analytics ingestion endpoint
- storefront analytics events
- dashboard analytics cards wired

### Milestone B
- sync metadata storage
- last sync and next sync real timestamps
- active currencies count from live data

### Milestone C
- remaining admin polish
- empty-state polish
- additional reliability improvements

---

## Immediate Note

The two items explicitly needing work now are:
- `Conversion analytics`
- `Last sync time / next sync time`

These should be treated as the next active implementation block.
