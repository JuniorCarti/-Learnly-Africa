# Prompt 2 · User Flow Diagrams & Analysis

## 1. Smallholder Farmer (Feature Phone + Low Literacy)
```mermaid
flowchart TD
  A[Start: Dial *384*888# or SMS keyword] --> B{New or existing?}
  B -- New --> R[Registration USSD]
  R --> R1[Enter Name]
  R1 --> R2[Select Main Crop]
  R2 --> R3[Enter Acreage]
  R3 --> R4[PIN Setup via SMS OTP]
  R4 --> H[Success Msg + Alert Opt-in]
  B -- Existing --> L[Login via PIN]
  L --> C{Menu Selected}
  C -->|1 Prices| P[Pull Market Data]
  C -->|2 Alerts| AL[Latest Alerts]
  C -->|3 Report Issue| RI[Issue Capture SMS/MMS]
  C -->|4 Insurance| IN[Insurance Status]
  C -->|5 Call Agent| AG[Auto Dial]
  C -->|6 Language| LANG[Toggle]
  C -->|0 Exit| END[Goodbye SMS]
  RI --> PH[Optional MMS Photo Upload]
  AL --> ACK[USSD/SMS Acknowledge]
```

- **Decision Points**: new vs existing, crop selection, language toggle, confirm submissions.
- **Error Handling**: retries for invalid PIN (lock after 3 attempts), fallback text instructions for MMS not supported, auto-suggest to call agent if USSD fails.
- **Success Metrics**: registration completion rate, average alert acknowledgment time, number of market checks per week, insurance claim submissions.

## 2. Cooperative Manager (Web Dashboard)
```mermaid
flowchart LR
  S[Login MFA] --> D[Dashboard Overview]
  D --> M{Action Chosen}
  M -->|Members| MD[Member Directory]
  M -->|Advisory| AD[Compose Advisory]
  M -->|Market| MK[Market Analysis]
  M -->|Reports| RP[Generate Report]
  MD --> MD1[Search/Filter]
  MD1 --> MP[Member Profile]
  MP --> GA[Send Group Message]
  AD --> AD1[Select Template]
  AD1 --> AD2[Target Audience]
  AD2 --> AD3[Schedule & Channels]
  AD3 --> AD4[Preview & Send]
  MK --> MK1[Compare Markets]
  MK1 --> MK2[Buyer Matching]
  RP --> RP1[Select Report Type]
  RP1 --> RP2[Configure Metrics]
  RP2 --> DL[Download PDF/Excel]
```

- **Decision Points**: template vs custom advisory, distribution channels (SMS/WhatsApp/email), report time range, target segment filters.
- **Error Handling**: validation for missing template fields, network retry banners, fallback CSV export if PDF generation fails, auto-save drafts every 30 seconds.
- **Success Metrics**: advisory open rate, time-to-publish, % members with complete profiles, report generation duration, number of bulk actions without errors.

## 3. Field Agent (Mobile + Offline)
```mermaid
flowchart TD
  A[Agent Launches App] --> B[Sync Pending Data]
  B --> C{Connectivity?}
  C -- Online --> SYNC[Bi-directional Sync]
  C -- Offline --> OFF[Work Offline Mode]
  OFF --> H[Home Tasks]
  SYNC --> H
  H --> T1[Register Farmer]
  H --> T2[Collect Data]
  H --> T3[Deliver Advisory]
  H --> T4[Report Issues]
  T1 --> F1[Capture Farmer Info]
  F1 --> F2[Verify via OTP]
  T2 --> DC1[Upload Photos/Notes]
  T3 --> AD1[Select Advisory Pack]
  AD1 --> AD2[Confirm Delivery]
  T4 --> IR1[Log Issue + Severity]
  IR1 --> IR2[Attach Media]
  All --> QUEUE[Queue Items if Offline]
  QUEUE --> RETRY[Auto-sync when Online]
```

- **Decision Points**: offline vs online workflows, queue vs immediate send, escalate issue vs resolve locally.
- **Error Handling**: auto retries with exponential backoff, manual "Force Sync" button, conflict resolution prompts when same farmer edited by multiple agents.
- **Success Metrics**: average time per registration, # of offline records synced without conflict, advisory delivery confirmation rate, issue resolution SLA adherence.

## 4. System Admin
```mermaid
flowchart LR
  SA[Admin Login (SSO + Hardware Key)] --> DASH[System Dashboard]
  DASH --> UM[User Management]
  DASH --> AC[Alert Configuration]
  DASH --> DM[Data Monitoring]
  DASH --> AN[Analytics]
  UM --> UM1[Role Assignment]
  UM1 --> UM2[Deactivate/Reactivate]
  AC --> AC1[Create Alert Template]
  AC1 --> AC2[Set Thresholds + Channels]
  AC2 --> AC3[Approval Workflow]
  DM --> DM1[Data Quality Rules]
  DM1 --> DM2[Resolve Anomalies]
  AN --> AN1[Usage Analytics]
  AN1 --> AN2[Export/Share Insights]
```

- **Decision Points**: severity level per alert, auto vs manual alert dispatch, retention period for data snapshots, enforcement of approvals.
- **Error Handling**: rollback on failed alert template deploy, audit log capture for role changes, detection of missing data pipelines with red status indicator.
- **Success Metrics**: number of critical alerts configured vs triggered, mean time to detect data issues, policy compliance rate, admin SLA for responding to escalations.

## Shared Error Handling Patterns
- **Session Timeouts**: extendable via "Stay signed in" prompts; unsaved form data preserved locally.
- **Invalid Inputs**: inline hints + iconography; for low-literacy flows use audio prompts or icons.
- **System Downtime**: broadcast banner + SMS fallback to all critical users with ETA updates.

## KPIs Dashboarding
| Persona | KPI | Tooling | Target |
|---------|-----|---------|--------|
| Farmer | Alert acknowledgment time | Socket.IO events + analytics | < 10 mins for urgent |
| Cooperative Manager | Advisory open rate | Delivery receipts + analytics | > 65% |
| Field Agent | Offline sync success | Sync queue logs | > 98% |
| System Admin | SLA for incident resolution | Ops dashboard | < 30 mins |
