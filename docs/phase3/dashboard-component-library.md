# Prompt 7 · Dashboard Component Library
_All components live in `frontend/src/components/dashboard` with shared styles in `frontend/src/styles/dashboard.css`. Storybook stories: `__stories__/DashboardComponents.stories.tsx`. Unit tests: `__tests__/DashboardComponents.test.tsx`._

## 1. `AlertCard`
- **Props**: `type`, `severity`, `title`, `message`, `timestamp`, `details`, `actions`, `onAcknowledge`, `isAcknowledged`.
- **Features**: severity-colored border, emoji icon, expandable details, action button group (Acknowledged, custom actions), optional acknowledgement chip.
- **Usage**:
```tsx
<AlertCard
  severity="urgent"
  type="climate"
  title="Drought Alert"
  message="Irrigate within 48h"
  timestamp="Today · 10:30"
  actions={[{ label: "Action Plan", variant: "primary" }]}
  onAcknowledge={() => markAlert()}
/>
```
- **Tests** ensure `Acknowledge` button triggers callback.

## 2. `CropStatusWidget`
- **Props**: `cropType`, `plantingDate`, `growthStage`, `healthScore`, `issues`, `acreage`, `quickActions`.
- **Features**: growth-stage progress bar, health chip with color-coded status, days since planting calc, issue list, quick actions (Add photo, Request visit, Mark harvested).
- **Usage**: pair with crop data cards in dashboard grid.

## 3. `MarketComparisonTable`
- **Props**: `crop`, `markets[]`, `currentLocation`, `onContactBuyer`.
- **Features**: sortable columns (price, distance, net profit), net profit highlight, CTA to contact buyers, recommendation highlight row.
- **Usage**: display `markets` array of `MarketEntry` objects (id, name, pricePerKg, distance, transport cost, timestamp).

## 4. `ClimateIndicator`
- **Props**: `metricType`, `currentValue`, `threshold`, `trend`, `history[]`, `unit`.
- **Features**: gauge bar with threshold marker, trend indicator arrows, history mini-cards.
- **Usage**: pass `history` array like `[ { label: "3d avg", value: 51 } ]` to display supporting stats.

## 5. `MapView`
- **Props**: `center`, `zoom`, `markers`, `layers`, `onMarkerClick`, `enableDrawing`, `onDrawComplete`.
- **Features**: Mapbox GL canvas, layer toggles (Roads/Satellite/Terrain), marker types (farmer/market/agent/risk), drawing mode with measurement chip (context menu to finish), cluster-ready by passing aggregated markers.
- **Usage**: supply `markers` array from farmer/cooperative data to visualize distribution and measure distances when planning routes.

## 6. `AdvisoryFeed`
- **Props**: `advisories[]`, `filters`, `onSave`, `onShare`.
- **Features**: filter selects (crop, issue type), search, card layout with media attachments, Save/Share CTAs, saved state indicator.

## Storybook Stories
- File: `frontend/src/components/dashboard/__stories__/DashboardComponents.stories.tsx`.
- Stories: `UrgentAlert`, `CropWidgetStory`, `MarketTableStory`, `ClimateIndicatorStory`, `MapViewStory`, `AdvisoryFeedStory`.
- Run via `npm run storybook` (script defined in `package.json`). Stories demonstrate knobs/args for severity, data sets, etc.

## Unit Tests
- File: `frontend/src/components/dashboard/__tests__/DashboardComponents.test.tsx`.
- Covered behaviors: alert acknowledgement, crop widget rendering, market recommendation.
- Mocked `mapbox-gl` to keep tests deterministic. Execute with `npm test`.

## Developer Notes
- Keep dependencies (Mapbox token, theme variables) defined globally to reuse across components.
- When adding new severities or issue types, update CSS tokens + component config for consistent color semantics.
- Provide translated labels via `react-i18next` wrappers when integrating into the app.
