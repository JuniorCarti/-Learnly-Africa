import React, { useMemo, useState } from "react";
import clsx from "clsx";
import "../../styles/dashboard.css";

export interface MarketEntry {
  id: string;
  name: string;
  pricePerKg: number;
  distanceKm: number;
  transportCostPerKg: number;
  buyerContact?: string;
  lastUpdated: string;
}

export type SortKey = "price" | "distance" | "net";

export interface MarketComparisonTableProps {
  crop: string;
  markets: MarketEntry[];
  currentLocation?: string;
  onContactBuyer?: (marketId: string) => void;
}

export const MarketComparisonTable: React.FC<MarketComparisonTableProps> = ({
  crop,
  markets,
  currentLocation,
  onContactBuyer,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>("net");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const sortedMarkets = useMemo(() => {
    const list = [...markets];
    return list.sort((a, b) => {
      const getValue = (entry: MarketEntry) => {
        if (sortKey === "price") return entry.pricePerKg;
        if (sortKey === "distance") return entry.distanceKm;
        return entry.pricePerKg - entry.transportCostPerKg;
      };
      const value = getValue(a) - getValue(b);
      return sortDir === "asc" ? value : -value;
    });
  }, [markets, sortKey, sortDir]);

  const recommendation = sortedMarkets[0];

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "distance" ? "asc" : "desc");
    }
  };

  return (
    <section className="market-table">
      <header>
        <div>
          <h3>Market comparison · {crop}</h3>
          {currentLocation && <small>From {currentLocation}</small>}
        </div>
        {recommendation && (
          <p className="recommendation">
            Recommendation: sell at <strong>{recommendation.name}</strong>
          </p>
        )}
      </header>
      <table>
        <thead>
          <tr>
            <th>Market</th>
            <th>
              <button type="button" onClick={() => onSort("price")}>
                Price (KES/kg)
                {sortKey === "price" && (sortDir === "asc" ? " ↑" : " ↓")}
              </button>
            </th>
            <th>
              <button type="button" onClick={() => onSort("distance")}>
                Distance (km)
                {sortKey === "distance" && (sortDir === "asc" ? " ↑" : " ↓")}
              </button>
            </th>
            <th>Transport (KES/kg)</th>
            <th>
              <button type="button" onClick={() => onSort("net")}>
                Net Profit
                {sortKey === "net" && (sortDir === "asc" ? " ↑" : " ↓")}
              </button>
            </th>
            <th>Contact</th>
          </tr>
        </thead>
        <tbody>
          {sortedMarkets.map((entry) => {
            const net = entry.pricePerKg - entry.transportCostPerKg;
            const highlight = recommendation?.id === entry.id;
            return (
              <tr key={entry.id} className={clsx(highlight && "highlight")}> 
                <td>
                  <strong>{entry.name}</strong>
                  <small>Updated {entry.lastUpdated}</small>
                </td>
                <td>{entry.pricePerKg.toFixed(2)}</td>
                <td>{entry.distanceKm.toFixed(1)}</td>
                <td>{entry.transportCostPerKg.toFixed(2)}</td>
                <td>
                  <span className={clsx("net", net >= 0 ? "positive" : "negative")}>{net.toFixed(2)}</span>
                </td>
                <td>
                  <button className="btn btn-outline" type="button" onClick={() => onContactBuyer?.(entry.id)}>
                    Contact Buyer
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
};
