# Prompt 3 · Farmer Mobile App Wireframes (Low-Fidelity)
_Target device: Android 8+, intermittent connectivity, Swahili-first, icon-heavy UI._

## Global Navigation & Principles
- Bottom tab icons only (Weather, Alerts, Markets, Crops, More) with optional Swahili labels on long press.
- Top status bar shows sync icon (offline/online), unread alerts badge, language toggle (EN/SW).
- All actions reachable with one thumb; minimum touch targets 48×48px; offline indicator persistently visible.

## 1. Login / Registration Screen
```
┌──────────────────────────────┐
│  SHAMBA AI LOGO              │
│  "Karibu" / "Welcome"        │
├──────────────────────────────┤
│ 📱 Phone Number              │
│ [+254 |______________]       │
│ 🔐 4-Digit PIN               │
│ [• • • •] (setup on first)   │
├───────┬────────┬─────────────┤
│ 🌍 Location Permission       │
│ [Allow]  [Later]             │
├───────┬────────┬─────────────┤
│ 🗣️ Language: [SW] [EN]       │
├──────────────────────────────┤
│ ▶️ CONTINUE (primary)        │
│ ↪ USSD / SMS help link       │
└──────────────────────────────┘
```
Navigation: onboarding carousel → phone input → OTP modal → PIN setup → location prompt.

## 2. Home / Dashboard
```
┌──────────────────────────────┐
│ Weather Chip  🌤️  25°C  SW   │
│ "Mvua kesho asubuhi"         │
├────── ALERTS BANNER ─────────┤
│ 🔴 Drought warning – Tap >   │
├────────── QUICK ACTIONS ─────┤
│ [💰 Prices] [⚠️ Report] [📞 Call]│
├──────── Crop Status ─────────┤
│ 🌽 Maize  Stage: Tasseling   │
│ Health: 🟡 Moderate          │
│ Harvest ETA: 2 weeks         │
│ [Add Photo]   [View]         │
├──────────────────────────────┤
│ Offline Cache: 3 advisories  │
└──────────────────────────────┘
Tabs: Weather | Alerts | Markets | Crops | More.
```

## 3. Alerts Screen
```
┌──────────────────────────────┐
│ Filters: [Climate] [Market]  │
│          [Insurance] [Advis.]│
├──────────────────────────────┤
│ 🔴 URGENT  (red bar)         │
│ "Ukame mkali"                │
│ 10:30 · Embu Ward            │
│ [Acknowledge]  [Help]        │
├──────────────────────────────┤
│ 🟡 WARNING                   │
│ Pest risk nearby             │
│ [View Steps] [Share]         │
├──────────────────────────────┤
│ 🟢 INFO                      │
│ Market tips ready            │
└──────────────────────────────┘
```
- Swipe left to mark as read, right to save offline.
- Floating toggle to display only unacknowledged.

## 4. Market Intelligence
```
┌──────────────────────────────┐
│ Crop Carousel: 🌽  🍅  🫘      │
├──────── Current Prices ──────┤
│ Local Center   50 KES/kg     │
│ Nakuru Market  65 (+15)      │
│ Net Profit     40            │
├──── Where to Sell Today ─────┤
│ ✅ Sell locally (transport)   │
│ Reason: Low transport cost   │
├──── Transport Calculator ────┤
│ Distance: [ 80 ] km          │
│ Cost/kg:  [ 10 ]             │
│ [Recalculate]                │
└──────────────────────────────┘
```
- Offline note indicates last sync timestamp.
- CTA to request agent call if numbers look wrong.

## 5. Crop Management
```
┌──────────────────────────────┐
│ + ADD NEW CROP               │
├──────────────────────────────┤
│ Card: 🌾 Wheat (2 ac)        │
│ Stage: Growth  | Health 🟢   │
│ Buttons: [Upload Photo]      │
│           [Update Stage]     │
├──── Growth Timeline ─────────┤
│ ◉ Planting  ──●── Harvest    │
│ Current Stage marker         │
├──── Harvest Indicator ───────┤
│ "Wiki 3 kufikia mavuno"     │
└──────────────────────────────┘
```
- Photo uploader works offline, queued until connectivity returns.

## 6. Insurance
```
┌──────────────────────────────┐
│ Coverage: ACTIVE 🟢          │
│ Policy #: INS-2025-001       │
├──── Trigger Monitor ─────────┤
│ Rainfall Index   65% (target 70)
│ Soil Moisture    40% (⚠️ low)  │
├──── Payout History ──────────┤
│ 2024-11 Flood  Paid 5,000 KES │
├──── Claim Action ────────────┤
│ [File Claim] [Call Agent]    │
│ Upload docs/photo (optional) │
└──────────────────────────────┘
```
- Display autopay threshold, manual claim CTA when auto-trigger fails.

## Offline & Navigation Notes
- Global toast area shows sync, errors, or success states.
- Primary nav: bottom tabs; secondary nav: floating FAB for "Report Issue" (camera icon) accessible from any screen.
- Each screen surfaces EN toggle for bilingual support.

## Data Display Areas Summary
| Screen | Key Data Widgets |
|--------|------------------|
| Login | phone input, PIN pad, language toggles |
| Home | weather summary, alert banner, quick actions, crop cards |
| Alerts | severity-coded cards with acknowledgment buttons |
| Market | price table, recommendation, calculator |
| Crops | crop list cards, growth timeline, action buttons |
| Insurance | policy status, trigger monitors, history list, claim CTA |
