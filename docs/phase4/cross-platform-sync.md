# Prompt 9 · Cross-Platform Sync Design

## 1. Sync Architecture
```
User Action → Local Cache (MMKV/IndexedDB) → Sync Queue → API Gateway → Central DB
       ↑                                                     ↓
    Offline banner                                  Conflict resolver
       ↑                                                     ↓
Background sync ← Net status monitor → Real-time WebSocket updates
```
- **Local cache**: farmers (mobile) use MMKV; web uses IndexedDB w/ Workbox; USSD/SMS always server-first but logs mirrored for analytics.
- **Sync queue**: prioritized FIFO with categories (critical alerts, crop updates, media uploads). Each item has retry policy + exponential backoff.
- **Background sync**: triggered on connectivity regain, scheduled interval (10 min), or manual "Sync now" gesture.

## 2. Entities & Payloads
| Entity | Fields | Channels |
|--------|--------|----------|
| User profile | name, phone, language, role, preferences | mobile, web |
| Crop records | crop type, acreage, planting/harvest, photos | mobile, agent app |
| Alerts | alert metadata, ack state | all |
| Market queries | crop, location, timestamp, recommendations | mobile, USSD |
| Insurance | policy status, triggers, claims | mobile, web |
| Advisory bookmarks | saved advisories, notes, attachments | mobile, web |

## 3. Conflict Resolution
- **Last write wins** for low-impact data (language preference, saved markets) with timestamp metadata.
- **Manual merge** for crop records: agent mobile app surfaces diff (field agent vs farmer) with side-by-side compare and "Accept" per field.
- **Alerts**: mobile acknowledgement prioritized; server resolves duplicates by keeping earliest ack.
- **Market data**: server authoritative; offline cache flagged with "stale" banner until refreshed.

## 4. Sync Status Components
### Sync Indicator
States + copy:
- `syncing`: 🔄 “Syncing your data…”
- `synced`: ✅ “All data up to date”
- `offline`: 📴 “Working offline” + CTA “Retry connection”
- `error`: ❌ “Sync failed – Retrying (1/3)” + `Report` button
- `conflict`: ⚠️ “Data conflict – Review needed” opens resolver dialog.

### Sync Settings Screen
- Toggles: Auto-sync on Wi-Fi only, Sync over data, Include media on mobile data.
- Buttons: `Sync now`, `Clear local cache` (with warnings), `View history` (log of last 10 syncs).
- Diagnostics: API latency, queue length, last failure message.

### Conflict Resolution UI
- Table comparing local vs server fields.
- Buttons: `Keep local`, `Use server`, `Merge` (when both have list fields), `Escalate to support`.
- Show metadata: timestamps, originating device, agent ID.

### Data Backup / Restore Flow
1. Choose backup destination (Cloud, SD card for Android).
2. Encrypt with user PIN.
3. Provide passphrase and confirm.
4. For restore: verify identity, preview data summary, confirm overwrite.

### Cross-Device Pairing
- QR code display on web → scan via mobile to link account.
- OTP fallback for feature phones.
- Device list with revoke button.

### Data Usage Dashboard
- Charts: data synced per channel (alerts, media, advisories), top consuming actions.
- Controls: limit background sync, compress images toggle.

## 5. Progressive Enhancement
- SMS/USSD remains baseline (server state), ensures registration/alerts continue without smart device.
- Mobile app adds offline caching, photo uploads, push notifications.
- Web dashboard adds multi-panel analytics, real-time websockets, drag-drop data export.

## 6. Data Migration Flows
1. **USSD → Mobile**: enter phone + OTP in app → fetch server profile → prompt to set PIN + download cached advisories.
2. **Multi-device unification**: server canonical profile; new device triggers "transfer data" wizard copying local caches.
3. **Cooperative imports**: upload CSV/Excel, mapping wizard, validation report, preview before commit.
4. **Legacy paper records**: offline template (Excel/CSV) → upload → OCR/agent verification queue.

## 7. API Considerations
- Endpoints expose `syncToken` (vector clock). Clients send `If-None-Match` for delta fetch.
- Media uploads chunked + resumable (tus protocol) to survive poor connectivity.
- Alerts socket events include `version` to deduplicate.

## 8. Monitoring & Metrics
- Track queue length per user, sync failure reasons, time-to-consistency across devices.
- Alerts to ops when conflict rate >5% per day or ack delays >15 min.
