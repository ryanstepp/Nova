import type { UpdateState } from "../../types/nova";

export const initialUpdateState: UpdateState = {
  currentVersion: "0.1.0",
  availableVersion: null,
  automaticUpdates: false,
  status: "idle",
  releaseNotes: [
    "Nova begins with a boot flow, lock screen, home surface, and app shell.",
    "Manual updates are scaffolded for a future remote JSON endpoint."
  ],
  lastCheckedAt: null
};

export function checkForMockUpdate(state: UpdateState): UpdateState {
  return {
    ...state,
    availableVersion: "0.1.1",
    status: "available",
    lastCheckedAt: new Date().toISOString(),
    releaseNotes: [
      "Improved window restoration hooks.",
      "Prepared update metadata for remote delivery.",
      "Refined notification grouping behavior."
    ]
  };
}
