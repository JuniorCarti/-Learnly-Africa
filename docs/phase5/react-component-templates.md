# Prompt 12 · React Component Templates
_All templates implemented in `frontend/src/components/templates/index.tsx` with shared styling in `frontend/src/styles/templates.css`._

## 1. `ShambaPage`
- **Props**: `title`, `subtitle?`, `children`, `actions?`, `isLoading?`, `error?`.
- **Behavior**: renders consistent page header, handles loading (via `ShambaLoader`), error (via `ShambaError`), and mounts `ShambaToast` region.
- **Usage**:
```tsx
<ShambaPage
  title="Climate Alerts"
  subtitle="Realtime status"
  actions={<Button>Add alert</Button>}
  isLoading={isFetching}
>
  <AlertsGrid />
</ShambaPage>
```

## 2. `DataCard`
- **Props**: `title`, `value`, `icon`, `trend?`, `trendValue?`, `onClick?`, `color?`.
- **Features**: color-coded background, trend indicator (▲ ▼ ➖), accessible button semantics.
- **Example**: ` <DataCard title="Members" value={1280} icon={<Users />} trend="up" trendValue="12%" />`

## 3. `ShambaForm`
- **Props**: `initialValues`, `onSubmit`, `validationSchema` (Zod or Yup), render prop (`children`), `submitText`.
- **Features**:
  - Auto-resolver detection (zod/yup) via `@hookform/resolvers`.
  - Exposes `FormChildrenProps` { form, isSubmitting, submitError } to child render function.
  - Handles async submit + error message display.
- **Usage**:
```tsx
const schema = z.object({ name: z.string().min(2) });
<ShambaForm initialValues={{ name: "" }} validationSchema={schema} onSubmit={saveFarmer}>
  {({ form, isSubmitting }) => (
    <>
      <input {...form.register("name")} />
      {form.formState.errors.name && <span>Required</span>}
    </>
  )}
</ShambaForm>
```

## 4. `ShambaList`
- **Props**: `items`, `renderItem`, `keyExtractor`, `emptyComponent?`, `loading?`, `onRefresh?`, `loadMore?`, `hasMore?`, `filters?`, `title?`.
- **Features**: built-in refresh button, empty-state fallback, infinite-scroll sentinel using `IntersectionObserver`.
- **Usage**:
```tsx
<ShambaList
  title="Farmers"
  items={farmers}
  loading={isLoading}
  onRefresh={refetch}
  loadMore={fetchNext}
  hasMore={hasNext}
  renderItem={(farmer) => <FarmerRow {...farmer} />}
  keyExtractor={(farmer) => farmer.id}
/>
```

## 5. `ShambaMap`
- **Props**: `center`, `zoom`, `markers`, `onMarkerClick?`, `drawingMode?`, `onDrawComplete?`.
- **Features**: Mapbox GL integration, custom marker buttons per type (farmer/market/agent/risk), optional drawing mode with live distance measurement, navigation + scale controls.
- **Usage**:
```tsx
<ShambaMap
  center={[36.8219, -1.2921]}
  zoom={7}
  markers={[{ id: "m1", position: [36.9, -1.2], title: "MK", type: "market" }]}
  drawingMode
  onDrawComplete={(coords) => console.log(coords)}
/>
```

## Helper Components
- `ShambaLoader`: spinner with optional compact style.
- `ShambaError`: standard error panel with retry button.
- `ShambaToast`: ephemeral toast region with success/error/info variants.

## Styling
- CSS variables defined in `templates.css` (colors, radii, shadows) aligned with Prompt 6 palette.
- Buttons share `.btn`, `.btn-primary`, `.btn-outline`, `.btn-ghost` classes for consistency.

## Usage Documentation
- Include these templates through `import { ShambaPage, DataCard, ShambaForm, ShambaList, ShambaMap } from "@/components/templates";`
- Provide Mapbox token via `VITE_MAPBOX_TOKEN` for web builds.
- For server-side rendering/Next.js, gate Mapbox usage behind `useEffect` to avoid SSR issues.

## Testing Hooks
- `ShambaList` exposes sentinel element for intersection observer; tests can mock `IntersectionObserver` or call `loadMore` manually.
- `ShambaForm` uses RHF, so integrate with React Testing Library by rendering children and using `fireEvent.submit`.
