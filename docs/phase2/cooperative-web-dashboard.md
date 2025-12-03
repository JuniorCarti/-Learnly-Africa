# Prompt 4 · Cooperative Web Dashboard Wireframes
_Responsive layout (≥1024px desktop, collapsible sidebar for tablets). Color palette aligns with SHAMBA green/blue theme._

## Global Layout
- Left sidebar: app logo, navigation (Dashboard, Members, Market, Advisory, Reports, Settings), quick-action buttons ("+ Advisory", "Export"), collapse toggle.
- Top bar: search, notifications, profile dropdown, environment badge (Staging/Prod), language toggle.
- Content grid uses 12-column layout with cards emphasizing data viz.

## 1. Main Dashboard View
```
┌──────────────────────────────────────────────────────────┐
│ Sidebar │  Top Bar (Search | Alerts | Profile)          │
├─────────┴────────────────────────────────────────────────┤
│ KPI Cards (4 cols)                                      │
│ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐             │
│ │Members │ │Alerts  │ │Markets │ │Insur. │             │
│ └────────┘ └────────┘ └────────┘ └────────┘             │
├──────────────────────────────────────────────────────────┤
│ Map View (8 cols)      | Recent Alerts (4 cols stacked) │
│ [Mapbox map w/ members]│ [List + severity badges]       │
├──────────────────────────────────────────────────────────┤
│ Top Recommendations (accordion cards)                    │
│ e.g. "Sell maize in Nakuru"  CTA buttons                │
└──────────────────────────────────────────────────────────┘
```
- Map controls: layer toggles (Satellite/Terrain), filter by crop, risk overlays.
- Alert list includes action buttons ("Action Plan", "Dismiss", "Notify Agents").

## 2. Member Management Section
```
┌──────────────────────────────────────────────┐
│ Toolbar: [Search] [Filters] [Import CSV]     │
├──────────────────────────────────────────────┤
│ Table View (Name | Crop | Acreage | Status) │
│ Rows with inline badges for health alerts   │
├──────────────────────────────────────────────┤
│ Right Pane: Selected Member Profile         │
│ - Contact info                              │
│ - Crops + acreage pie                       │
│ - Last advisory sent                        │
│ - Quick actions: Message, Assign agent      │
├──────────────────────────────────────────────┤
│ Bottom Drawer: Group Messaging / Bulk Export│
└──────────────────────────────────────────────┘
```
- On tablet, table flips to card list with swipe actions.

## 3. Market Intelligence Section
```
┌────────────────────────────────────────────────────┐
│ Filters: Crop dropdown, Region multi-select, Date  │
├────────────────────────────────────────────────────┤
│ Price Comparison Chart (line/column combo)        │
├────────────────────────────────────────────────────┤
│ Demand Forecast Widget (sparkline + status chip)  │
├────────────────────────────────────────────────────┤
│ Buyer Matching Table                              │
│ Columns: Buyer, Demand, Volume, Contact, CTA      │
├────────────────────────────────────────────────────┤
│ Logistics Panel                                   │
│ - Route planner map                               │
│ - Transport availability list                     │
└────────────────────────────────────────────────────┘
```
- Quick action buttons: "Share with members", "Book transport", "Send advisory".

## 4. Advisory Management
```
┌──────────────────────────────────────────┐
│ Tabs: Drafts | Templates | History       │
├──────────────────────────────────────────┤
│ Editor Split Screen                     │
│ Left: Template library, attachments     │
│ Center: Rich text editor + merge tags   │
│ Right: Preview (SMS, WhatsApp, Voice)   │
├──────────────────────────────────────────┤
│ Delivery Tracking Table                 │
│ Columns: Member Segment, Channel, Status│
│ With progress bars + response rate chips│
└──────────────────────────────────────────┘
```
- CTA row: `Save Draft`, `Schedule`, `Send Now` (primary). Analytics sparkline at bottom for engagement trends.

## 5. Reporting Section
```
┌────────────────────────────────────────────┐
│ Wizard Steps (left vertical)               │
│ 1 Choose type                              │
│ 2 Metrics                                  │
│ 3 Time frame                               │
│ 4 Output format                            │
├────────────────────────────────────────────┤
│ Main Canvas                                │
│ - Cards summarizing selections             │
│ - Preview chart/table                      │
├────────────────────────────────────────────┤
│ Export bar: [PDF] [Excel] [CSV] [Schedule] │
└────────────────────────────────────────────┘
```
- Additional quick buttons for frequent reports (Insurance, Market, Productivity, Climate Impact).

## Interaction Patterns & Accessibility
- Sticky action buttons anchored bottom-right ("+ Advisory", "Export Members").
- Keyboard shortcuts: `g+d` dashboard, `g+m` members, `g+a` advisory.
- All charts include data table toggle for screen readers.
- Color usage follows primary green (#2E7D32) for positive, blue (#1565C0) for informational, orange (#FF9800) for warnings.
