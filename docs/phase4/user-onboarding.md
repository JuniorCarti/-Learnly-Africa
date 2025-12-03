# Prompt 10 · User Onboarding Flow

## Shared Principles
- 5-step progress indicator with labels + ability to skip non-mandatory steps.
- "Save & continue later" button persists partial data to backend (draft onboarding record) + offline cache.
- Provide Swahili/English toggle throughout.

## 1. Farmer Onboarding (Mobile)
### Step 1 · Welcome
- Screen copy: “Welcome to SHAMBA AI – Your climate-smart farming assistant.”
- Buttons: `[Continue in English]` `[Endelea kwa Kiswahili]`.

### Step 2 · Phone Verification
- Form: country code selector (defaults +254) + phone input.
- Buttons: `Send Code`, `Resend in 30s`. Show countdown.
- OTP entry with auto-advance; fallback `Call me instead` for IVR.

### Step 3 · Farm Setup
- Multi-select chips for crops (Maize, Tomatoes, Potatoes, Beans, Other).
- Acreage numeric input with units toggle (acres/hectares).
- Location capture: `Use current location` button + Mapbox picker fallback.

### Step 4 · Permissions
- Checklist of requirements with icons: Location, SMS, Camera, Storage.
- Buttons: `Allow All` (primary) and `Customize` (opens toggles).

### Step 5 · Quick Tutorial
- Carousel with four cards (Climate alerts, Market insights, Insurance automation, Personal advice).
- Buttons: `Skip`, `Next`, `Start Using`.

### Completion Screen
- Confetti animation, success message, CTA `Go to Dashboard`. Provide `Need help? Call agent` link.

## 2. Cooperative Onboarding (Web)
1. **Organization Setup**: capture org name, region, contact, regulatory IDs. Validate unique slug.
2. **Member Import**: upload CSV/XLS or connect to existing MIS; mapping wizard highlights errors; show sample preview.
3. **Service Configuration**: choose modules (market intelligence, advisory, insurance), set alert preferences, Mapbox region defaults.
4. **Team Setup**: invite administrators, assign roles, configure MFA requirements.
5. **Integration Setup**: connect to SMS gateways, accounting systems, and CRM via API keys; verify with test pings.
- Each step includes helper text + docs link; progress indicator at top; final summary screen with "Download onboarding report".

## 3. Field Agent Onboarding (Mobile/Web Hybrid)
1. **Agent Registration**: field agent enters code provided by cooperative, verifies identity with ID photo; admin approval flow.
2. **Training Materials**: interactive checklist (videos, quizzes, offline PDF). Track completion metrics.
3. **Territory Assignment**: map UI to confirm assigned wards; ability to download offline map tiles.
4. **Tools Setup**: ensure device diagnostics pass (battery, GPS, camera). Provide quick toggles for offline data sync radius.
5. **First Assignment**: app auto-generates first 5 tasks (register farmer, collect soil sample, deliver advisory). Display success criteria and due dates.

## UX Safeguards
- Auto-save draft after each field; display “Saved at 14:32” message.
- If connectivity drops, show `Working offline` ribbon + allow continuing (sync once online).
- Provide contextual support: tooltips, chat with mentor, call agent.

## Success Confirmation & Next Steps
- After onboarding, show summary screen with:
  - Completed steps checkmarks
  - Outstanding tasks (if any) with `Resume` button
  - Resource links (User guide, FAQs, Support contact)
- Send SMS/email confirmation with login details.

## Analytics
- KPIs: completion rate per persona, time per step, drop-off points, permission grant rate.
- A/B test onboarding copy and tutorials to optimize comprehension for low-literacy farmers.
