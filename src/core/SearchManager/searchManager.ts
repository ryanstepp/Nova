import type { NovaApp, SearchResult } from "../../types/nova";
import { settingCategories } from "../SettingsManager/settingsCatalog";

const fileResults: SearchResult[] = [
  { id: "file-readme", type: "file", title: "Nova Roadmap", subtitle: "Documents", action: "Open in Files" },
  { id: "history-home", type: "history", title: "nova://start", subtitle: "Browser history", action: "Open in Browser" },
  { id: "note-ideas", type: "note", title: "Desktop ideas", subtitle: "Notes", action: "Open in Notes" }
];

export function searchNova(query: string, apps: NovaApp[]): SearchResult[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return [];
  }

  const appResults = apps.map<SearchResult>((app) => ({
    id: `app-${app.id}`,
    type: "app",
    title: app.name,
    subtitle: app.description,
    action: "Launch app"
  }));

  const settingResults = settingCategories.map<SearchResult>((setting) => ({
    id: `setting-${setting.id}`,
    type: "setting",
    title: setting.name,
    subtitle: setting.description,
    action: "Open Settings"
  }));

  const calculatorResult = buildCalculatorResult(normalized);
  const allResults = [...appResults, ...settingResults, ...fileResults, ...(calculatorResult ? [calculatorResult] : [])];

  return allResults.filter((result) =>
    `${result.title} ${result.subtitle} ${result.type}`.toLowerCase().includes(normalized)
  );
}

function buildCalculatorResult(query: string): SearchResult | null {
  if (!/^[\d\s+\-*/().]+$/.test(query)) {
    return null;
  }

  try {
    const value = Function(`"use strict"; return (${query})`)();
    if (typeof value !== "number" || Number.isNaN(value)) {
      return null;
    }

    return {
      id: "calculator-result",
      type: "calculator",
      title: `${query} = ${Number(value.toFixed(6))}`,
      subtitle: "Calculator result",
      action: "Open Calculator"
    };
  } catch {
    return null;
  }
}
