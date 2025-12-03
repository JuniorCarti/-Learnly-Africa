# Prompt 16 · Documentation Templates

## 1. README Template
```markdown
# SHAMBA AI - Climate-Smart Farming Platform

## Overview
<Describe purpose + personas>

## Features
- 🌧️ Real-time climate alerts
- 💰 Market price intelligence
- 🛡️ Automated parametric insurance
- 🌱 Personalized advisory
- 👥 Cooperative management tools

## Quick Start
```bash
git clone https://github.com/yourorg/shamba-ai.git
cd shamba-ai
```
1. **Backend**
```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn app.main:app --reload
```
2. **Frontend**
```bash
cd frontend
npm install
npm run dev
```
3. **Access**: http://localhost:3000

## Documentation
- [API Documentation](docs/api.md)
- [Database Schema](docs/database.md)
- [Deployment Guide](docs/deployment.md)
- [User Guide](docs/user-guide.md)

## Contributing
Reference CONTRIBUTING.md (branching, linting, tests).

## License
MIT
```

## 2. API Documentation Template
```markdown
# SHAMBA AI API Documentation

## Authentication
All requests require JWT in `Authorization: Bearer <token>` header.

## Endpoints
### Climate Alerts
`GET /api/v1/climate/alerts`
**Parameters**: `region`, `severity`, `page`, `limit`
**Response**:
```json
{ "alerts": [{ "id": "uuid", "type": "drought", "severity": "high", "title": "Drought Alert", "message": "Severe drought detected...", "location": {"type": "Polygon", "coordinates": [...]}, "validFrom": "2024-01-15T10:30:00Z", "validUntil": "2024-01-20T10:30:00Z" }] }
```
### Market Prices
`GET /api/v1/market/prices?crop=maize&location=-1.2921,36.8219`
**Parameters**: `crop`, `location`, `radius`
**Errors**:
| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check params |
| 401 | Unauthorized | Refresh token |
| 404 | Not Found | Validate ID |
| 500 | Internal Error | Contact support |
```

Include section for versioning, rate limits, webhook callbacks.

### OpenAPI/Swagger
- Maintain `openapi.yaml` (v3) describing schemas + security.
- Generate interactive docs via FastAPI Swagger UI or Stoplight.

## 3. User Guide Template
```markdown
# SHAMBA AI User Guide

## Farmers
1. Register with phone number / USSD *384*888#
2. Set up farm details
3. Add crops & photos
4. Receive alerts + advisories

### Using USSD
Dial *384*888# → [1] Prices, [2] Advisory, [3] Report issue, [4] Insurance, [5] Call agent.

### Mobile App
- Real-time alerts
- Crop health monitoring
- Market comparison
- Insurance tracking

## Cooperatives
- Import members
- Group messaging
- Bulk advisory sending
- Market coordination

## Troubleshooting
- Not receiving alerts? Check SMS permissions + network.
- Prices outdated? Refresh data / check internet.
- Insurance claim stuck? Contact field agent or support.
```

## 4. Development Guide Template
```markdown
# Development Guide

## Architecture
```
┌─────────────┐ → ┌──────────────┐ → ┌─────────────┐
│ Frontend    │   │ API (FastAPI)│   │ PostgreSQL  │
└─────────────┘   └──────────────┘   └─────────────┘
          ↓
     AI Models
```

## Prerequisites
- Node.js 18+
- Python 3.9+
- Docker & Docker Compose
- PostgreSQL 15
- Redis

## Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Database Setup
```bash
docker compose up -d postgres redis
psql -h localhost -U shamba -d shamba_ai < database/schema.sql
```

## Testing
```bash
cd backend && pytest
cd frontend && npm test
npm run cypress:open
```

## Code Style
- Backend: Black + isort + Ruff
- Frontend: ESLint + Prettier
- Commits: Conventional commits
```

## 5. Additional Templates
### API (OpenAPI/Swagger)
- Maintain `docs/openapi.yaml` with schemas, securitySchemes, responses.
- Use stoplight or Redocly for publishing.

### Database Migration Guides
- Template `docs/migrations/<timestamp>-<name>.md` documenting context, SQL scripts, rollback steps, testing notes.

### Security Policies
- `SECURITY.md` includes reporting process, SLA, supported versions.
- `ThreatModel.md` (STRIDE) + mitigation table.

### Support Procedures
- Runbook template: Description, Trigger, Owner, Steps, Validation, Escalation contacts.
- Incident communication template (status page updates, SMS to field agents).

### Training Materials
- Slide deck outline: Introduction, Device setup, Core workflows per persona, Troubleshooting.
- Checklist PDF for field agents verifying readiness (app installed, permissions granted, offline data downloaded).

### User Research & Feedback
- Form template capturing persona, scenario, issues, suggestions, severity.

### Release Notes
- Format: Version, Date, Highlights, Fixes, Known Issues, Action for users.

These templates ensure every phase (engineering, ops, support) stays consistent with SHAMBA AI’s accessibility-first mission.
