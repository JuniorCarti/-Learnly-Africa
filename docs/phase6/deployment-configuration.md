# Prompt 15 · Deployment, Environments & Monitoring

## 1. Docker Assets
- **Backend** (`backend/Dockerfile`): Python 3.9 FastAPI image, installs from `requirements.txt`, runs `uvicorn app.main:app --host 0.0.0.0 --port 8000`.
- **Frontend** (`frontend/Dockerfile`): Node 18 Alpine build → Nginx static server using `frontend/nginx.conf` SPA rules.
- **Reverse Proxy** (`nginx/nginx.conf`): Multi-upstream config forwarding `/api` to backend, static assets served from `/usr/share/nginx/html`.
- Build commands: `docker build -t shamba/backend backend` and `docker build -t shamba/frontend frontend`.

## 2. Docker Compose (`deployment/docker-compose.yml`)
Services: Postgres 15 + PostGIS, Redis 7, backend, frontend, nginx. Volumes for Postgres data. `env_file` pulls vars from `.env.example` (copy to `.env`).

### Local Workflow
```bash
cp .env.example .env
cd deployment
docker compose up --build
```
Access web at `http://localhost:3000`, API via `http://localhost:8000` or `http://localhost/api` through nginx.

## 3. Environment Variables (`.env.example`)
- DB credentials, `DATABASE_URL`
- Cache/messaging (`REDIS_URL`)
- API keys (Mapbox, Twilio, SendGrid)
- App-level settings (`NODE_ENV`, `API_URL`, `APP_URL`, `JWT_SECRET`, `SOCKET_RATE_LIMIT`)
- Storage details (S3 bucket/region + AWS credentials)

## 4. Kubernetes Manifests (`deployment/kubernetes`)
| File | Purpose |
|------|---------|
| `configmap.yaml` | Shared config (`NODE_ENV`, API URLs, rate limit) |
| `secret.yaml` | Encoded secrets (DB password, JWT secret, Mapbox token) |
| `backend-deployment.yaml` | 3 replicas, readiness/liveness probes, resource requests, envFrom config/secret |
| `frontend-deployment.yaml` | 2 replicas for SPA assets |
| `services.yaml` | ClusterIP services for backend + frontend |
| `ingress.yaml` | TLS ingress (Let’s Encrypt) routing `api.shamba.ai` and `app.shamba.ai` |
| `pvc.yaml` | Persistent storage for Postgres + media (RWX) |
| `hpa.yaml` | HPAs for backend (3–10 pods, 60% CPU) and frontend (2–6 pods, 50% CPU) |

Namespace `shamba` assumed. Apply order: ConfigMap/Secret → PVC → Deployments → Services → Ingress → HPA.

## 5. CI/CD (`deployment/ci-cd/github-actions.yml`)
Pipeline stages:
1. **Test**: lint + unit on frontend (npm), placeholder backend pytest, data pipeline lint. Postgres service for API tests.
2. **Build & Push**: docker build/push to GHCR for backend/front.
3. **Deploy**: on `main`, apply K8s manifests via `kubectl`, run smoke tests.

Secrets required: `GITHUB_TOKEN`, `KUBECONFIG`, optional `PAGERDUTY_KEY`.

## 6. Monitoring & Logging (`deployment/monitoring`)
- `prometheus.yml`: scrapes backend, frontend, node exporter.
- `grafana-dashboard.json`: sample widgets for latency, alert acknowledgement, queue length.
- `alertmanager.yml`: routes severity alerts to email + PagerDuty.
- `logging.yaml`: Fluent Bit config streaming logs to Loki cluster.

Metrics tracked: HTTP latency (p95), alert acknowledgement seconds, sync queue size, CPU/memory, HPA stats.

## 7. Environment Strategy
| Env | Branch | Infra | Notes |
|-----|--------|-------|-------|
| Local | feature branches | Docker Compose | Uses `.env` + seeded data |
| Staging | `staging` | Kubernetes namespace `shamba-staging`, GHCR images with `-staging` tag | Feature flags default on |
| Production | `main` | Multi-AZ cluster, global CDN, WAF | Blue/green deploy via `kubectl rollout` |

## 8. Backup & Recovery
- **Database**: PITR via WAL archiving to S3; nightly logical dumps (`pg_dump`) retained 30 days.
- **Object storage**: versioned bucket for media; lifecycle rules to Glacier after 90 days.
- **Configuration**: Terraform/state stored in secure bucket, PR-reviewed.
- **Disaster Recovery**: RTO 2h, RPO 15m; runbooks for DB restore + DNS failover.

## 9. Scaling & Resilience
- HPAs auto-scale based on CPU; can add custom metrics (queue length, request latency).
- Redis (cache/Socket.IO) deployed as managed service or statefulset with sentinel.
- Use `PodDisruptionBudget` to maintain at least 2 backend pods during maintenance.
- CDN caching for static assets reduces frontend load.
- Multi-channel alerting: fallback to Twilio SMS if push fails.

## 10. Security & Compliance
- Secrets managed via Kubernetes Secrets + sealed secrets pipeline.
- Network policies restrict DB access to backend namespace only.
- Container images scanned via GH Advanced Security / Trivy in CI.

## 11. Monitoring Playbooks
- **Alert: High ack time** (>15 min). Action: check Socket.IO, queue, network; fallback SMS broadcast.
- **Alert: Sync queue >100**. Action: scale background workers; inspect data-pipeline logs.
- **Alert: API latency p95 > 800ms**. Action: check DB performance, add read replica, warm caches.
