# Prompt 14 · PostgreSQL/PostGIS Schema
_PostgreSQL 15 + PostGIS 3.4. Naming convention: snake_case, plural tables. All tables include `created_at`/`updated_at` (defaults via triggers)._ 

## 1. Users & Authentication
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('farmer','agent','cooperative','admin')),
  language VARCHAR(10) NOT NULL DEFAULT 'sw',
  location GEOMETRY(Point, 4326),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  alert_preferences JSONB DEFAULT '{}'::jsonb,
  notification_channels JSONB DEFAULT jsonb_build_array('sms'),
  data_sharing_consent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_location ON users USING GIST (location);
```

## 2. Farms & Crops
```sql
CREATE TABLE farms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  size_hectares DECIMAL(10,2) CHECK (size_hectares >= 0),
  location GEOMETRY(Polygon, 4326),
  soil_type VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_farms_location ON farms USING GIST (location);

CREATE TABLE crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  crop_type VARCHAR(100) NOT NULL,
  variety VARCHAR(100),
  planting_date DATE NOT NULL,
  expected_harvest_date DATE,
  actual_harvest_date DATE,
  area_hectares DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'active',
  growth_stage VARCHAR(50) DEFAULT 'seedling',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_crops_type ON crops(crop_type);
```

## 3. Climate & Alerts
```sql
CREATE TABLE climate_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) CHECK (severity IN ('low','medium','high','critical')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  affected_area GEOMETRY(Polygon, 4326) NOT NULL,
  trigger_conditions JSONB,
  valid_from TIMESTAMP WITH TIME ZONE NOT NULL,
  valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_climate_alerts_area ON climate_alerts USING GIST (affected_area);
CREATE INDEX idx_climate_alerts_validity ON climate_alerts(valid_until);

CREATE TABLE user_alerts (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  alert_id UUID REFERENCES climate_alerts(id) ON DELETE CASCADE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  delivery_channel VARCHAR(50),
  priority INTEGER DEFAULT 0,
  PRIMARY KEY (user_id, alert_id)
);
```

## 4. Market Data
```sql
CREATE TABLE market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  market_name VARCHAR(255) NOT NULL,
  location GEOMETRY(Point, 4326) NOT NULL,
  crop_type VARCHAR(100) NOT NULL,
  price_per_kg DECIMAL(10,2) NOT NULL,
  quality_grade VARCHAR(20),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  source VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_market_prices_loc ON market_prices USING GIST (location);
CREATE INDEX idx_market_prices_crop ON market_prices(crop_type, recorded_at DESC);

CREATE TABLE transport_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_location GEOMETRY(Point, 4326) NOT NULL,
  to_location GEOMETRY(Point, 4326) NOT NULL,
  distance_km DECIMAL(10,2) NOT NULL,
  cost_per_kg DECIMAL(10,2) NOT NULL,
  estimated_hours DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 5. Insurance
```sql
CREATE TABLE insurance_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  crop_id UUID REFERENCES crops(id) ON DELETE SET NULL,
  coverage_type VARCHAR(50) NOT NULL,
  sum_insured DECIMAL(15,2) NOT NULL,
  premium DECIMAL(15,2) NOT NULL,
  trigger_conditions JSONB,
  status VARCHAR(20) DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE insurance_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES insurance_policies(id) ON DELETE CASCADE,
  amount DECIMAL(15,2) NOT NULL,
  trigger_conditions_met JSONB,
  paid_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 6. Advisory Content
```sql
CREATE TABLE advisories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  advisory_type VARCHAR(50) NOT NULL,
  target_crops TEXT[] DEFAULT '{}',
  target_regions TEXT[] DEFAULT '{}',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  media_urls TEXT[] DEFAULT '{}'
);

CREATE TABLE advisory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisory_id UUID REFERENCES advisories(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  channel VARCHAR(20) NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'delivered'
);
```

## 7. Audit & Triggers
```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  entity VARCHAR(100) NOT NULL,
  entity_id UUID NOT NULL,
  user_id UUID,
  action VARCHAR(50) NOT NULL,
  snapshot JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
-- repeat for crops, farms, insurance_policies etc.
```

## 8. Partitioning Strategy
- `climate_alerts`: range partitioned by `valid_from` month to speed archival.
- `market_prices`: monthly partitions based on `recorded_at`.
- `advisory_logs`: hash partitioned by `user_id` for large-scale messaging logs.

Example:
```sql
CREATE TABLE climate_alerts_2025_01 PARTITION OF climate_alerts
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

## 9. Sample Data
```sql
INSERT INTO users (id, phone_number, full_name, user_type, language)
VALUES ('6f2b0cba-32f0-4e45-a1d0-9f9e0c40d210', '+254700111222', 'Amina Mwangi', 'farmer', 'sw');

INSERT INTO farms (user_id, name, size_hectares)
VALUES ('6f2b0cba-32f0-4e45-a1d0-9f9e0c40d210', 'Kijiji Farm', 1.20);

INSERT INTO crops (farm_id, crop_type, planting_date, area_hectares)
VALUES ((SELECT id FROM farms LIMIT 1), 'maize', '2024-03-01', 1.20);

INSERT INTO climate_alerts (alert_type, severity, title, message, affected_area, trigger_conditions, valid_from, valid_until)
VALUES ('drought','high','Drought Alert','Irrigate within 48h',
  ST_GeomFromText('POLYGON((36.8 -1.3,36.9 -1.3,36.9 -1.2,36.8 -1.2,36.8 -1.3))', 4326),
  '{"rainfall": "<20mm"}', NOW(), NOW() + INTERVAL '3 day');
```

## 10. Data Security & Compliance
- Sensitive columns (phone numbers, payouts) encrypted using PgCrypto or application-layer envelope encryption.
- Row-level security for cooperatives (restrict member rows by `cooperative_id`).
- Background job to purge stale PII (GDPR compliance) after retention period.

## 11. Backup & Maintenance
- PITR (Point-in-time recovery) enabled via WAL archiving.
- Nightly vacuum/analyze schedule for partitioned tables.
- Materialized views for `market_price_summary` refreshed hourly.
