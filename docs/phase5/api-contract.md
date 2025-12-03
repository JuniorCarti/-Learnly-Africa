# Prompt 13 · REST API Contract (v1)
_Base URL: `https://api.shamba.ai/api/v1`. All responses JSON. Authentication via HTTP `Authorization: Bearer <JWT>` unless noted. Rate limit default: 60 req/min per IP; urgent alert endpoints 200 req/min._

## 1. Authentication
### POST `/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "phoneNumber": "+254712345678",
  "fullName": "Amina Mwangi",
  "userType": "farmer",
  "language": "sw",
  "pin": "1234",
  "referralCode": "AGT-55"
}
```
- **Response 201**:
```json
{ "userId": "uuid", "requiresVerification": true }
```
- **Errors**: 400 (validation), 409 (phone exists).

### POST `/auth/login`
- **Body**: `{ "phoneNumber": "", "pin": "" }`
- **Response**: `{ "accessToken": "jwt", "refreshToken": "uuid", "expiresIn": 3600 }`
- **Errors**: 401 invalid credentials, 423 account locked.

### POST `/auth/verify-phone`
- **Body**: `{ "phoneNumber": "", "otp": "123456" }`
- **Response**: `{ "verified": true }`

### POST `/auth/reset-password`
- **Body**: `{ "phoneNumber": "", "otp": "", "newPin": "1234" }`
- **Response**: `{ "status": "reset" }`

### GET `/auth/profile`
- **Headers**: `Authorization`
- **Response**:
```json
{
  "id": "uuid",
  "phoneNumber": "+2547...",
  "fullName": "",
  "userType": "farmer",
  "language": "sw",
  "preferences": {"alerts": ["climate"], "channels": ["sms"]}
}
```

### PUT `/auth/profile`
- **Body**: partial profile payload; server enforces field-level validation.

## 2. Climate Data
### GET `/climate/alerts`
- **Query**: `?region=embu&severity=urgent`
- **Response**: `{ "alerts": [ { "id": "uuid", "type": "drought", "severity": "high", "title": "", "message": "", "validFrom": "ISO", "validUntil": "ISO", "affectedArea": {"type":"Polygon","coordinates":[] } } ] }`

### GET `/climate/alerts/{id}`
- **Response**: alert detail + `actions`, `resources` arrays.

### POST `/climate/alerts/{id}/acknowledge`
- **Body**: `{ "channel": "mobile", "deviceId": "uuid" }`
- **Response**: `{ "status": "acknowledged", "timestamp": "ISO" }`

### GET `/climate/indicators`
- Returns list of metrics (soil moisture, rainfall). Query `?metric=soil_moisture&location=-1.29,36.82`.

### GET `/climate/history`
- Query `?metric=rainfall&from=2024-01-01&to=2024-02-01`.
- Response: `{ "data": [{"date": "2024-01-01", "value": 18.4}] }`

### GET `/climate/risk-zones`
- Response: GeoJSON FeatureCollection with risk metadata.

## 3. Market Intelligence
### GET `/market/prices`
- Query: `crop`, `location`, `radius`
- Response: `{ "prices": [{"market":"Nakuru","pricePerKg":65,"distanceKm":120,"updatedAt":"ISO"}] }`

### GET `/market/prices/{crop}`
- Path param `crop` (maize, tomatoes...).

### GET `/market/recommendations`
- Query: `?crop=maize&location=-1.29,36.82`
- Response: best market + reasoning & transport breakdown.

### GET `/market/buyers`
- Response includes buyer contact info, demand volume, reliability score.

### POST `/market/contact-buyer`
- **Body**: `{ "buyerId": "uuid", "message": "Looking to sell 2 tons" }`
- **Response**: `{ "status": "sent", "channel": "sms" }`

### GET `/market/transport-costs`
- Query `?from=-1.29,36.82&to=-0.09,34.75&weight=2000`

## 4. Crop Management
### GET `/crops`
- Supports pagination `?page=1&limit=20` and filters `?status=active`.

### POST `/crops`
- **Body**:
```json
{
  "farmId": "uuid",
  "cropType": "maize",
  "variety": "H614",
  "plantingDate": "2024-03-01",
  "expectedHarvestDate": "2024-08-15",
  "areaHectares": 1.2
}
```
- **Response 201**: `{"id":"uuid"}`

### GET/PUT/DELETE `/crops/{id}`
- PUT accepts partial updates; returns updated record.

### POST `/crops/{id}/photos`
- Multipart upload fields: `photo`, `capturedAt`, `notes`. Returns media ID + processing status.

### GET `/crops/{id}/health`
- Response: health score, detected issues, recommendations.

### POST `/crops/{id}/harvest`
- Body: `{ "actualHarvestDate": "2024-08-12", "yieldKg": 2400 }`

## 5. Insurance
### GET `/insurance/policies`
- Response array with coverage type, status, triggers.

### POST `/insurance/policies`
- Body includes `userId`, `cropId`, `coverageType`, `sumInsured`, `premium`, `triggerConditions`.

### GET `/insurance/policies/{id}`
- Returns policy detail + payout history.

### GET `/insurance/claims`
- Query filters `status=pending`.

### POST `/insurance/claims`
- Body: `{ "policyId": "uuid", "incidentDate": "ISO", "description": "", "evidence": ["mediaId"] }`

### GET `/insurance/triggers`
- Response: configured trigger definitions (rainfall index, NDVI thresholds).

### POST `/insurance/triggers/{id}/check`
- Body: `{ "location": [-1.29,36.82], "date": "2024-10-15" }`
- Response: `{ "status": "triggered", "details": { ... } }`

## 6. Advisory
### GET `/advisories`
- Query filters: `crop`, `issueType`, `date`.
- Response: paginated list with metadata, attachments.

### GET `/advisories/{id}`
- Returns markdown content, media list, translation fields.

### POST `/advisories/{id}/save`
- Body: `{ "note": "Remind me tomorrow" }`
- Response: `{ "saved": true }`

### POST `/advisories/{id}/share`
- Body: `{ "channel": "sms", "recipient": "+2547..." }`

### GET `/advisories/templates`
- Response: template metadata for admin interface.

### POST `/advisories/send`
- Body includes `templateId`, `targets`, `channels`, `scheduleAt`.
- Response: job ID, estimated recipients, warnings if throttle triggered.

## 7. Cooperative
### GET `/cooperative/members`
- Supports search `?q=amina`, filters `crop=maize`, `status=active`.

### POST `/cooperative/members`
- Body: member payload (name, phone, crops, acreage). Response includes member ID + duplicates flagged.

### GET `/cooperative/stats`
- Returns aggregated KPIs: total members, active alerts, market opportunities, insurance coverage.

### POST `/cooperative/bulk-send`
- Body: `{ "memberIds": ["uuid"], "message": "Meeting 2pm", "channel": "sms" }`
- Response: send report with per-channel status.

### GET `/cooperative/reports`
- Query `?type=market-performance&from=2024-01-01&to=2024-03-01`. Response: file URL + metadata.

## Request / Response Standards
- **Headers**: `Authorization` (JWT), `X-Request-Id` (client-generated), `Accept-Language` (sw/en).
- **Pagination**: `page`, `limit`, response includes `meta` { page, limit, totalPages, totalItems }.
- **Errors**:
```json
{
  "error": {
    "code": "API_500_001",
    "message": "Service temporarily unavailable",
    "details": {
      "field": "phoneNumber",
      "reason": "already_exists"
    },
    "traceId": "uuid"
  }
}
```
- **Rate limiting**: default `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`. Critical alert ack endpoint whitelisted to higher quota.

## Example cURL Requests
```bash
# Login
curl -X POST https://api.shamba.ai/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"+254712345678","pin":"1234"}'

# Fetch market recommendations
curl -H "Authorization: Bearer $TOKEN" \
  "https://api.shamba.ai/api/v1/market/recommendations?crop=maize&location=-1.29,36.82"

# Acknowledge alert
curl -X POST -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"channel":"mobile","deviceId":"device-123"}' \
  https://api.shamba.ai/api/v1/climate/alerts/1c2f/acknowledge
```
