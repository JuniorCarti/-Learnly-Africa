import type { Meta, StoryObj } from "@storybook/react";
import { AlertCard, AlertCardProps } from "../AlertCard";
import { CropStatusWidget, CropStatusWidgetProps } from "../CropStatusWidget";
import { MarketComparisonTable, MarketComparisonTableProps } from "../MarketComparisonTable";
import { ClimateIndicator, ClimateIndicatorProps } from "../ClimateIndicator";
import { MapView, MapViewProps } from "../MapView";
import { AdvisoryFeed, AdvisoryFeedProps } from "../AdvisoryFeed";

const meta: Meta<AlertCardProps> = {
  title: "Dashboard/AlertCard",
  component: AlertCard,
  args: {
    severity: "urgent",
    type: "climate",
    title: "Flood risk in lower ward",
    message: "Heavy rainfall expected in 48 hours.",
    timestamp: "Today · 10:30",
    details: "Trigger threshold crossed for rainfall index.",
  },
};
export default meta;
type Story = StoryObj<AlertCardProps>;

export const UrgentAlert: Story = {
  render: (args) => (
    <AlertCard
      {...args}
      actions={[
        { label: "Action Plan", variant: "primary" },
        { label: "Dismiss", variant: "ghost" },
      ]}
    />
  ),
};

export const CropWidgetStory: StoryObj<CropStatusWidgetProps> = {
  render: () => (
    <CropStatusWidget
      cropType="Maize"
      plantingDate="2024-09-01"
      growthStage="flowering"
      healthScore={72}
      acreage={2.5}
      issues={[{ id: "1", label: "Armyworm", severity: "medium" }]}
      quickActions={{}}
    />
  ),
};

export const MarketTableStory: StoryObj<MarketComparisonTableProps> = {
  render: () => (
    <MarketComparisonTable
      crop="Maize"
      currentLocation="Eldoret"
      markets={[
        { id: "1", name: "Eldoret", pricePerKg: 50, distanceKm: 5, transportCostPerKg: 2, lastUpdated: "10m ago" },
        { id: "2", name: "Nakuru", pricePerKg: 65, distanceKm: 150, transportCostPerKg: 12, lastUpdated: "5m ago" },
      ]}
    />
  ),
};

export const ClimateIndicatorStory: StoryObj<ClimateIndicatorProps> = {
  render: () => (
    <ClimateIndicator
      metricType="Soil moisture"
      currentValue={40}
      threshold={55}
      trend="down"
      history={[
        { label: "Yesterday", value: 52 },
        { label: "3d avg", value: 48 },
      ]}
    />
  ),
};

export const MapViewStory: StoryObj<MapViewProps> = {
  render: () => (
    <MapView
      center={[36.8219, -1.2921]}
      zoom={7}
      markers={[
        { id: "f1", position: [36.8, -1.29], title: "FM", type: "farmer" },
        { id: "m1", position: [36.9, -1.21], title: "MK", type: "market" },
      ]}
    />
  ),
};

export const AdvisoryFeedStory: StoryObj<AdvisoryFeedProps> = {
  render: () => (
    <AdvisoryFeed
      advisories={[
        {
          id: "1",
          crop: "Maize",
          issueType: "Drought",
          date: "Today",
          title: "Irrigation tips",
          content: "Irrigate within 48 hours to avoid stress.",
          mediaType: "image",
          mediaUrl: "https://example.com/image.jpg",
        },
      ]}
    />
  ),
};
