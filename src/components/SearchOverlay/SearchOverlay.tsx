import { Search, X } from "lucide-react";
import type { SearchResult } from "../../types/nova";
import styles from "./SearchOverlay.module.css";

interface SearchOverlayProps {
  query: string;
  results: SearchResult[];
  onChange: (query: string) => void;
  onClose: () => void;
}

export function SearchOverlay({ query, results, onChange, onClose }: SearchOverlayProps) {
  return (
    <div className={styles.scrim}>
      <section className={styles.overlay} aria-label="Nova Search">
        <div className={styles.searchBox}>
          <Search size={20} />
          <input autoFocus value={query} onChange={(event) => onChange(event.target.value)} placeholder="Search apps, files, settings, notes..." />
          <button aria-label="Close search" onClick={onClose} type="button">
            <X size={18} />
          </button>
        </div>
        <div className={styles.results}>
          {results.length ? (
            results.map((result) => (
              <button key={result.id} className={styles.result} type="button">
                <span>{result.type}</span>
                <strong>{result.title}</strong>
                <small>{result.subtitle}</small>
                <em>{result.action}</em>
              </button>
            ))
          ) : (
            <p>{query ? "No results yet." : "Start typing to search Nova."}</p>
          )}
        </div>
      </section>
    </div>
  );
}
