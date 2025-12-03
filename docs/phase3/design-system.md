# Prompt 6 · SHAMBA AI Design System

## 1. Color Palette
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#2E7D32` | CTA buttons, positive progress, primary links |
| `--color-secondary` | `#1565C0` | Navigation highlights, informational cards |
| `--color-accent` | `#FF9800` | Warning surfaces, accent icons |
| `--color-success` | `#4CAF50` | Success messages, status pills |
| `--color-danger` | `#F44336` | Critical alerts, destructive buttons |
| `--color-neutral-100` | `#FAFDF9` | Background |
| `--color-neutral-200` | `#F5F5F5` | Cards background |
| `--color-neutral-600` | `#616161` | Secondary text |
| `--color-neutral-900` | `#1B1B1B` | Headings |

### CSS Variables
```css
:root {
  --color-primary: #2e7d32;
  --color-secondary: #1565c0;
  --color-accent: #ff9800;
  --color-success: #4caf50;
  --color-danger: #f44336;
  --color-info: #1565c0;
  --color-bg: #fafdF9;
  --color-surface: #f5f5f5;
  --color-text: #1b1b1b;
  --color-muted: #616161;
  --radius-md: 12px;
  --radius-lg: 20px;
  --shadow-card: 0 12px 30px rgba(16, 48, 20, 0.08);
}
```

## 2. Typography
- **Primary font**: Inter (web). Fallback stack: `"Inter", "Segoe UI", system-ui, sans-serif`.
- **Mobile**: SF Pro (iOS), Roboto (Android) configured via platform styles.
- **Sizes & Line Heights**:
  - Headline (H1): 24px / 36px / weight 700
  - Subtitle (H2): 18px / 28px / weight 500
  - Body: 16px / 24px / weight 400
  - Small: 14px / 20px / weight 400
- Minimum contrast ratio 4.5:1; text scaling up to 200% without layout break.

## 3. Component Specifications
### Buttons
| Variant | Styles | Usage |
|---------|--------|-------|
| Primary | Solid primary background, white text, rounded 12px | Main action per screen |
| Secondary | Outline secondary color, text secondary | Supporting actions |
| Outline | Neutral border, text colored by intent | Filter chips, tertiary actions |
| Icon | Circular 48px touch target, filled or outline | Quick actions, FAB |

```css
.btn {
  border-radius: 999px;
  font-weight: 600;
  min-height: 44px;
  padding: 0 24px;
}
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-secondary { background: var(--color-secondary); color: #fff; }
.btn-outline { border: 1px solid var(--color-muted); color: var(--color-text); }
.btn-icon { width: 48px; height: 48px; display: grid; place-items: center; }
```

### Alerts / Notifications
- Variants: success, warning, error, info.
- Include icon, title, supporting text, CTA region, timestamp.
- Optionally stackable with close button; default auto-dismiss 8s except urgent states.

### Cards
- Elevated surfaces with `var(--shadow-card)`, 16px padding, optional header + action row.
- Support status chips, metrics, charts.

### Forms
- Input field height 48px, label always visible (floating label optional), helper/error text reserved area.
- Checkboxes large (24px) with descriptive text; radio groups supported.
- Validation states: border + icon color-coded (success/danger).

### Navigation
- **Web**: left sidebar (collapsible) + top bar.
- **Mobile**: bottom nav (icon-first) + context-specific top bar.
- **USSD**: numeric menus.

### Data Visualization
- Colors: gradients from primary → secondary for positive trends, accent/danger for warning/critical.
- Provide sparkline + numeric summary; all charts convertible to tables for accessibility.
- Map styling: Mapbox custom style with muted neutrals, highlight members with colored markers.

## 4. Mobile Guidelines
- Touch target ≥ 44×44px; ensure spacing for glove use.
- Use safe-area padding (`useSafeAreaInsets`).
- Provide haptics for confirmations and warnings.
- Gesture support: pull-to-refresh on lists, swipe to acknowledge alerts, swipe cards for actions.
- Offline indicator pinned to top; auto-sync icon animation limited to 1.2s to minimize battery drain.

## 5. Accessibility
- WCAG AA compliance: high-contrast toggle increases contrast tokens by 20%.
- Screen reader labels for icons, reorder focus logically.
- Provide captions/transcripts for multimedia advisories.
- Keyboard navigation: skip links, focus outlines, trap focus inside modals.
- Reduced motion mode: disable parallax, minimize transitions.

## 6. Usage Guidelines
**Do**
- Use primary color for only one dominant action per view.
- Pair icons with text for low literacy (except bottom nav icons with tooltip).
- Maintain generous white space; rural connectivity demands clarity.

**Don't**
- Stack more than 3 alert colors in same list without sorting by severity.
- Use all caps for long Swahili text (hurts readability).
- Hide essential data behind hover-only states (touch-first design).

## 7. Tokens Delivery
- Provide JSON tokens for multi-platform usage (Figma, Style Dictionary): `docs/assets/tokens.json` (future).
- Export color + typography tokens to React Native via `@shopify/restyle` or custom theming hook.

## 8. Component Code Snippets
See `frontend/src/components/templates` and `frontend/src/components/dashboard` for production-ready implementations of buttons, alerts, cards, form inputs, nav shells, and chart wrappers. Example usage excerpt:
```tsx
<Button variant="primary" icon={<CloudSun />}>Tazama Hali ya Hewa</Button>
<Card title="Climate Alerts" actions={<Button variant="outline">View All</Button>}>
  <Alert severity="urgent" title="Flood Risk" message="Lower field" />
</Card>
```

## 9. Documentation & Distribution
- Storybook documents visual states (light/dark, high-contrast, mobile). See `frontend/.storybook` (future task) for config.
- Theming guidelines mirrored in mobile via shared token file.
- Accessibility checklist included in design review template.
