# Prompt 11 · Error, Empty & Loading States

## 1. Connectivity Issues
```
OFFLINE MODE
-------------
📶 No internet connection

You can still:
• View saved advisories
• Check cached prices
• Take crop photos
• Write notes

Data will sync when you are back online.
[Retry Connection] [Continue Offline]
```
- Show banner + optional modal; `Retry` triggers connectivity check + manual sync; `Continue Offline` closes modal but leaves banner.
- Provide timestamp of last successful sync.

## 2. No Data States
### Alerts
```
No alerts right now 🌤️
Great news! No urgent issues detected.
Check back later or explore:
[Market Prices] [Crop Advice] [Insurance]
```
- Present contextual CTAs to encourage exploration.

### Crops
```
Let's add your crops! 🌱
Tell us what you're growing for personalized alerts.
[Add First Crop] [Import from cooperative]
```
- Illustrations showing farmer planting; optionally show sample data screenshot to guide user.

## 3. Error Messages
### API Error
```
Service Temporarily Unavailable ⚠️
We're having technical difficulties.
Our team has been notified.
Error Code: API_500_001
Time: 14:30, 15 Nov 2023
[Try Again] [Report Issue] [Use Basic Mode]
```
- `Use Basic Mode` loads lightweight cached data and USSD fallback instructions.

### Location Error
```
Location Services Required 📍
SHAMBA AI needs your location to:
• Provide local weather alerts
• Find nearby markets
• Connect you with local agents
[Enable Location] [Enter Manually]
```
- Provide platform-specific guidance (iOS vs Android), open settings deep link.

## 4. Permission Denied
### Camera Permission
```
Camera Access Needed 📸
To analyze crop health from photos, please enable camera access:
• iOS: Settings → SHAMBA AI → Camera
• Android: App Info → Permissions → Camera
[Open Settings] [Skip for Now]
```
- If user skips, disable photo upload buttons + show tooltip with reminder.

## 5. Data Loading States
- Use skeleton screens replicating layout placeholders:
```
Home
┌─────────────────────┐
│ ░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░ │
│                     │
│ ░░░░░░░░░░░░░░░░░░░ │
│ ░░░░░░░░░░░░░░░░░░░ │
└─────────────────────┘
Loading your data...
```
- Provide shimmer animation, 2-second minimum display to avoid flash.

## 6. Technical Details Accessibility
- Each error card includes hidden section (accordion) labeled "Technical details" (API path, correlation ID). Visible to admins/support only or after tapping "More info".

## 7. Tone & Localization
- Friendly, encouraging language; use emojis sparingly.
- Keep messages ≤120 characters; support Swahili translation with same structure.

## 8. Implementation Hooks
- Error/empty state components exported from `frontend/src/components/templates/index.tsx` (ShambaError, ShambaLoader) and extended for specific contexts.
- Mobile uses React Native skeleton placeholders + `Lottie` animations for offline state.
- Analytics: log error type, resolution action, time spent in empty states.
