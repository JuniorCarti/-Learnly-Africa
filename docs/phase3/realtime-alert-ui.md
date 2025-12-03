# Prompt 8 · Real-Time Alert System UI

## 1. Alert Types & Visual Language
| Type | Color | Icon | Sound | Behavior |
|------|-------|------|-------|----------|
| URGENT | #F44336 border, red glow | ⚠️ | High-priority tone (max 2s) | Full-screen modal on mobile + sticky alert banner on web; requires acknowledgement |
| WARNING | #FF9800 outline | ⚠️ | Medium tone | Appears in notification center and dashboard list; optional acknowledgement |
| ADVISORY | #1565C0 border | ℹ️ | None | Listed chronologically in feed, grouped by crop |
| MARKET | #4CAF50 border | 💰 | Pleasant chime | Highlighted card with countdown for expiry |

## 2. Mobile Alert Popup Layout
```
┌───────────────────────────────┐
│ 🔴 URGENT: Drought Alert      │
│ ⚠️ Severe drought detected    │
│ Location: Your maize field    │
│ Time: 10:30 AM, Today         │
│ Impact: Crop stress           │
│ Action: Irrigate within 48h   │
│ [See Details] [Acknowledge]   │
│ [Get Help]                    │
└───────────────────────────────┘
```
- Appears as modal overlay; persists until `Acknowledge` tapped.
- Offline mode stores acknowledgement in sync queue.

## 3. Web Dashboard Alert Panel
```
ALERTS (3 new)
┌─────────────────────────────────┐
│ 🔴 URGENT: Flood Risk           │
│    Lower field, act now         │
│    [Dismiss] [Action Plan]      │
│                                 │
│ 🟠 WARNING: Pest detected       │
│    Nearby farms report issues   │
│    [Dismiss] [Prevention]       │
│                                 │
│ 🟢 MARKET: Price spike          │
│    Tomatoes +20% in Nakuru      │
│    [Dismiss] [Sell Now]         │
└─────────────────────────────────┘
```
- Panel docked right side; supports keyboard navigation and screen readers.
- Bulk selection checkboxes for mass actions.

## 4. Alert Management Workspace
- **Filters**: Type, Severity, Crop, Region, Date range.
- **Search**: Debounced text search across title/message.
- **Bulk Actions**: Mark read, assign to agent, archive, export CSV.
- **History Timeline**: Plot of alert volume with severity breakdown, time-to-acknowledgement metric overlay.
- **Custom Preferences**: Role-based template builder + delivery channels (SMS, Push, Email, Voice). Stored per segment.

## 5. Alert Creation (Admin/Agent)
1. **Template**: choose base (Flood, Pest, Market) or create from scratch.
2. **Audience**: select segments (crop, county, cooperative). Visual chip preview of recipients.
3. **Content**: multilingual message composer (Swahili default, English optional). Attachment support (image, audio, PDF).
4. **Delivery**: choose channels + fallback order, schedule immediate or time-based release.
5. **Preview**: device mockups for mobile, SMS, email; highlight characters count for SMS; confirm severity + acknowledgment requirements.
6. **Validate**: run rule checks (threshold met? duplicates?). Provide warnings before send.

## 6. Analytics Dashboard
- Cards: Delivery success %, Response rate, Avg acknowledgment time, Unreached recipients.
- Map heatmap: geographic distribution of acknowledgements.
- Breakdown charts: alerts per type/week, top-performing channels, market alert conversions.
- Export: PDF, CSV, or push to data warehouse.

## 7. Accessibility & Offline
- All alerts have ARIA roles (`role="alert"`), focus-trap modals, and text alternatives for icons.
- Offline store retains last 50 alerts; acknowledges queued with timestamp.
- Reduced-motion mode removes pulsing animations; high-contrast mode thickens borders.

## 8. Localization & Personalization
- Strings localized via i18next; dynamic placeholders ({{crop}}, {{location}}) resolved per user.
- For low-literacy farmers, include icon + short audio snippet (downloaded via CDN, optional auto-play with consent).

## 9. Technical Hooks
- Real-time updates via Socket.IO channels `alerts:{userId}` and `alerts:segment:{segmentId}`.
- Web caches via IndexedDB for resilience.
- Admin audit logs capture creation, edits, cancellations (immutable history).

## 10. Success Metrics
- URGENT alerts acknowledged >90% within 30 minutes.
- Delivery success rate >98% across channels.
- Market alert conversion >30% (click-through or agent contact).
- False-positive rate <3% (tracked via user feedback button in each alert).
