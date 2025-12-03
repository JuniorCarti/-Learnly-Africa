import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AlertCard } from "../AlertCard";
import { CropStatusWidget } from "../CropStatusWidget";
import { MarketComparisonTable } from "../MarketComparisonTable";

vi.mock("mapbox-gl", () => ({
  default: {
    Map: vi.fn().mockReturnValue({
      addControl: vi.fn(),
      flyTo: vi.fn(),
      setStyle: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    }),
    NavigationControl: vi.fn(),
  },
  Map: vi.fn(),
}));

describe("Dashboard components", () => {
  it("renders alert card with actions", () => {
    const onAck = vi.fn();
    render(
      <AlertCard
        severity="urgent"
        type="climate"
        title="Flood risk"
        message="River rising"
        timestamp="Now"
        onAcknowledge={onAck}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /acknowledge/i }));
    expect(onAck).toHaveBeenCalled();
  });

  it("displays crop widget data", () => {
    render(
      <CropStatusWidget
        cropType="Maize"
        plantingDate="2024-09-01"
        growthStage="vegetative"
        healthScore={80}
        issues={[]}
      />
    );
    expect(screen.getByText(/maize/i)).toBeInTheDocument();
  });

  it("sorts market table and highlights recommendation", () => {
    render(
      <MarketComparisonTable
        crop="Beans"
        markets={[
          { id: "1", name: "Nakuru", pricePerKg: 60, distanceKm: 120, transportCostPerKg: 10, lastUpdated: "10m" },
          { id: "2", name: "Eldoret", pricePerKg: 55, distanceKm: 30, transportCostPerKg: 5, lastUpdated: "5m" },
        ]}
      />
    );
    expect(screen.getByText(/recommendation/i)).toHaveTextContent("Nakuru");
  });
});
