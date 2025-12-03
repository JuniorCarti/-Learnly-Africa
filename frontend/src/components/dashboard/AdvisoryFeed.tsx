import React, { useMemo, useState } from "react";
import clsx from "clsx";
import "../../styles/dashboard.css";

export interface AdvisoryItem {
  id: string;
  crop: string;
  issueType: string;
  date: string;
  title: string;
  content: string;
  mediaType?: "image" | "video" | "audio" | "text";
  mediaUrl?: string;
  saved?: boolean;
}

export interface AdvisoryFeedProps {
  advisories: AdvisoryItem[];
  filters?: {
    crops?: string[];
    issueTypes?: string[];
    dateRange?: [string, string];
  };
  onSave?: (id: string) => void;
  onShare?: (id: string) => void;
}

export const AdvisoryFeed: React.FC<AdvisoryFeedProps> = ({ advisories, filters, onSave, onShare }) => {
  const [selectedCrop, setSelectedCrop] = useState<string>("all");
  const [selectedIssue, setSelectedIssue] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return advisories.filter((item) => {
      if (selectedCrop !== "all" && item.crop !== selectedCrop) return false;
      if (selectedIssue !== "all" && item.issueType !== selectedIssue) return false;
      if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [advisories, selectedCrop, selectedIssue, search]);

  const crops = Array.from(new Set(advisories.map((a) => a.crop)));
  const issueTypes = Array.from(new Set(advisories.map((a) => a.issueType)));

  return (
    <section className="advisory-feed">
      <header>
        <div>
          <h3>Advisory Feed</h3>
          <p>{filtered.length} items</p>
        </div>
        <div className="advisory-filters">
          <select value={selectedCrop} onChange={(event) => setSelectedCrop(event.target.value)}>
            <option value="all">All crops</option>
            {crops.map((crop) => (
              <option key={crop} value={crop}>
                {crop}
              </option>
            ))}
          </select>
          <select value={selectedIssue} onChange={(event) => setSelectedIssue(event.target.value)}>
            <option value="all">All issues</option>
            {issueTypes.map((issue) => (
              <option key={issue} value={issue}>
                {issue}
              </option>
            ))}
          </select>
          <input
            placeholder="Search title"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </header>

      <div className="advisory-feed__list">
        {filtered.map((advisory) => (
          <article key={advisory.id} className="advisory-card">
            <header>
              <div>
                <p className="eyebrow">
                  {advisory.crop} · {advisory.issueType}
                </p>
                <h4>{advisory.title}</h4>
              </div>
              <time>{advisory.date}</time>
            </header>
            <p>{advisory.content}</p>
            {advisory.mediaType && advisory.mediaUrl && (
              <div className={clsx("media", advisory.mediaType)}>
                <span>{advisory.mediaType.toUpperCase()}</span>
                <a href={advisory.mediaUrl} target="_blank" rel="noreferrer">
                  Open resource
                </a>
              </div>
            )}
            <footer>
              <button className="btn btn-outline" type="button" onClick={() => onSave?.(advisory.id)}>
                {advisory.saved ? "Saved" : "Save"}
              </button>
              <button className="btn btn-outline" type="button" onClick={() => onShare?.(advisory.id)}>
                Share
              </button>
            </footer>
          </article>
        ))}
      </div>
    </section>
  );
};
