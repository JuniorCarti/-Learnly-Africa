# Prompt 5 · USSD/SMS Interface Design

## Entry Point & Menu Structure
- Short code: `*384*888#`
- Language defaults to Swahili; type `99` to toggle English in any menu.
- Max 160 characters per screen; numbering restarted within each step.

### Main Menu Layout
```
SHAMBA AI
1. Bei za Sasa / Prices
2. Ushauri Mpya
3. Ripoti Shida
4. Bima Yangu
5. Piga Afisa (call)
6. Badilisha Lugha
0. Toka
```
- Hidden option `#` returns to previous menu.
- Timeout reminder after 15 seconds of inactivity.

## 1. Registration Flow
```
Welcome to SHAMBA AI
1. Register new account
2. Already registered? Login

> 1
Enter your full name:
> [text]
Select main crop:
1.Maize 2.Tomatoes 3.Potatoes 4.Beans 5.Other
> [choice]
Enter acreage (in acres):
> [123]
Set 4-digit PIN:
> [****]
Confirm PIN:
> [****]
Registration complete!
You will receive alerts.
```
- Validation: acreage max 4 digits, PIN must match confirmation; on mismatch, prompt once before restarting.
- SMS confirmation includes tips + USSD code reminder.

## 2. Main Menu Options
```
SHAMBA AI Menu:
1. Check current prices
2. Receive latest advisory
3. Report crop issue
4. Check insurance status
5. Call field agent
6. Change language
0. Exit
```
- Option 5 triggers auto-dial via SIM toolkit; fallback displays hotline.
- Option 6 toggles language and reloads menu.

## 3. Price Check Flow
```
Select crop:
1.Maize 2.Tomatoes 3.Potatoes 4.Beans 5.Other
> 1
Maize prices today:
Local: 50/kg
Nakuru: 65/kg (+15)
Transport: 10/kg
Recommend: Sell locally
0. Back 00. Main
```
- Additional pages for more markets (press `9` for next page).
- Error handling: if data >30 min old, display "Data refreshing, try again" plus option to receive SMS when ready.

## 4. Advisory Delivery
```
Latest advisory:
Drought alert. Mulch crops.
1. More details
2. Save for later
3. Share via SMS
#. Back 0. Main
```
- When user selects `1`, provide step-by-step instructions; `2` stores flag for offline mode; `3` requests recipient number.

## 5. Issue Reporting Flow
```
Report issue:
1. Pest
2. Disease
3. Weather damage
4. Other
> 2
Describe briefly (160 chars):
> [text]
Add photo? Send MMS to 20050.
After sending, reply DONE.
1. Done 2. Cancel
```
- Invalid input returns message "Chaguo si sahihi. Jaribu tena" with last menu repeated.

## 6. Insurance Status Flow
```
Insurance Summary:
Policy: Active
Trigger: Rainfall < 60mm
Status: 45mm recorded
1. Claim payout
2. View history
0. Back
```
- Claim flow asks for loss description + optional payout preference.

## 7. Alert System (Auto SMS)
```
ALERT: Drought detected.
Soil moisture critical.
Action: Irrigate if possible.
Reply HELP for assistance.
```
- `HELP` triggers call center callback and logs as priority.
- `ACK` records acknowledgement; failure to respond re-sends after 30 minutes.

## 8. Photo Submission via MMS
```
PHOTO CHECK
1. Take photo
2. Send to 20050 (MMS)
3. Reply DONE here
4. Receive quality report
```
- If MMS unsupported, USSD responds with "Simu haiwezi kutuma picha. Tuma kwa WhatsApp 20050".

## Error Handling Framework
| Scenario | Message | Recovery |
|----------|---------|----------|
| Invalid Option | "Chaguo si sahihi. Bonyeza # kurudi." | Re-display current menu |
| Timeout | "Muda umeisha. Bonyeza *384*888# kuendelea." | None |
| Service offline | "Huduma inaboreshwa. Ujumbe utatumwa baadaye." | Offer SMS alert |
| Network error | "Mtandao hafifu. Jaribu tena." | Auto retry suggestion |

## Success Metrics
- Registration completion time < 3 minutes.
- Price check response within 2 screens.
- Alert acknowledgement > 80% within 2 hours.
- Issue report follow-up triggered within 30 minutes.
