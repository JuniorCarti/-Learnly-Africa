# SHAMBA AI · Climate-Smart Smallholder Platform

SHAMBA AI delivers actionable insights to farmers, cooperatives, and field agents through mobile, web, USSD/SMS, and real-time alerting channels. This repository hosts the reference architecture, component templates, specs, and deployment scaffolding for the end-to-end platform.

## Key Capabilities
- 🌧️ **Climate intelligence**: PostGIS-backed climate alerts, Mapbox visual layers, and Socket.IO push messaging.
- 💰 **Market intelligence**: Live price feeds, transport cost modeling, buyer matching, and recommendation engine outputs.
- 🛡️ **Insurance lifecycle**: Trigger monitoring, payout tracking, and manual/automatic claims flows.
- 🌱 **Advisory + AI**: Crop management, photo-based diagnostics, and multilingual guidance tuned for low-literacy audiences.
- 👥 **Cooperative & admin tooling**: Member directories, bulk communications, analytics, and governance controls.

## Repository Structure
```
├── frontend/        # React + TS web dashboard
├── mobile/          # React Native app (Expo)
├── backend/         # Fastify API + Socket.IO
├── ai-models/       # Python ML pipelines
├── data-pipeline/   # Prefect/Airflow ETL jobs
└── docs/            # Prompt-by-prompt design deliverables
```
Detailed documents for every UI/UX & systems prompt live under `docs/phase*/`. Start with [`docs/phase1/project-architecture.md`](docs/phase1/project-architecture.md).

## Quick Start · Local Development
> Requirements: Node.js 18+, pnpm or npm, Python 3.9+, Docker Desktop, Mapbox token.

### 1. Frontend (Web)
```bash
cd frontend
npm install
npm run dev # http://localhost:5173
```
Environment variables (create `.env`):
```
VITE_API_URL=http://localhost:8000
VITE_SOCKET_URL=http://localhost:8000
VITE_MAPBOX_TOKEN=your_token
```

### 2. Mobile (Expo)
```bash
cd mobile
npm install
npm run start
```
Use Expo Go or `npm run android`. Offline-first data lives in MMKV/AsyncStorage; localization defaults to Swahili.

### 3. Backend (Fastify)
```bash
cd backend
npm install
cp .env.example .env
npm run dev # http://localhost:8000
```
`.env` essentials:
```
PORT=8000
DATABASE_URL=postgresql://shamba:password@localhost:5432/shamba_ai
JWT_SECRET=change_me
MAPBOX_TOKEN=your_token
SOCKET_RATE_LIMIT=100
```
Run tests with `npm test` and lint via `npm run lint`.

### 4. AI Models (Python)
```bash
cd ai-models
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
npm run train   # delegates to python pipeline
```
Key outputs stored in `mlruns/` with MLflow. Configure S3 endpoints via `.env`.

### 5. Data Pipeline
```bash
cd data-pipeline
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
npm run dev     # Run Prefect/ETL runner
```
Use `.env` to connect to Postgres/Redis and external feeds. DAG definitions live in `etl/`.

## Documentation Roadmap
| Phase | Content |
|-------|---------|
| Phase 1 | Architecture + user flow diagrams |
| Phase 2 | Wireframes (mobile, cooperative web, USSD/SMS) |
| Phase 3 | Design system, dashboard components, alert UI |
| Phase 4 | Sync model, onboarding, error/empty states |
| Phase 5 | React templates, API contract, DB schema |
| Phase 6 | Deployment config, documentation templates |

## Testing Matrix
- **Frontend**: `vitest`, React Testing Library, Storybook snapshots.
- **Mobile**: Jest + React Native Testing Library; Detox E2E (future).
- **Backend**: `vitest` (unit), `supertest` integration, Newman for API contract.
- **Pipelines/AI**: PyTest, Great Expectations for data quality, MLflow experiments.

## Deployment & Operations
- Docker & Docker Compose baselines in [`docs/phase6/deployment-configuration.md`](docs/phase6/deployment-configuration.md).
- Kubernetes manifests cover ConfigMaps, Secrets, Deployments, Services, Ingress, and HPAs.
- GitHub Actions pipeline handles lint/test, image builds, security scans, and staged deploys.
- Monitoring stack: Prometheus, Grafana, Alertmanager, Loki.

## Contribution Guidelines
1. Fork or branch from `main`.
2. Keep commits atomic; follow Conventional Commits (`feat:`, `fix:`, `docs:` ...).
3. Update relevant docs when adding/modifying features.
4. Run lint/test suites per module before pushing.

## Next Steps
1. Build hi-fi prototypes from the supplied wireframes.
2. Validate with farmer & cooperative focus groups.
3. Connect to live climate + market feeds.
4. Harden deployment & observability before pilot launch.

_Simple, accessible, and trustworthy UI/UX remains the guiding principle across every channel._
