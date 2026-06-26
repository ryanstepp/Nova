import type { NovaApp } from "../types/nova";
import {
  BrowserApp,
  CalculatorApp,
  CalendarApp,
  CameraApp,
  ClockApp,
  FilesApp,
  GalleryApp,
  MusicApp,
  NotesApp
} from "./BuiltInApps";
import { SettingsApp } from "./SettingsApp";

export const novaApps: NovaApp[] = [
  { id: "files", name: "Files", icon: "F", accent: "#4cc9f0", description: "Browse local folders, cloud spaces, and indexed documents.", component: FilesApp },
  { id: "browser", name: "Browser", icon: "B", accent: "#7bd88f", description: "A clean web surface with history and search integration.", component: BrowserApp },
  { id: "notes", name: "Notes", icon: "N", accent: "#ffd166", description: "Capture ideas, lists, and rich notes.", component: NotesApp },
  { id: "calculator", name: "Calculator", icon: "C", accent: "#f78c6b", description: "Fast calculations from the app or Nova Search.", component: CalculatorApp },
  { id: "calendar", name: "Calendar", icon: "D", accent: "#b8a1ff", description: "Events, reminders, and day planning.", component: CalendarApp },
  { id: "music", name: "Music", icon: "M", accent: "#ff6b9a", description: "Library, playback, and playlists.", component: MusicApp },
  { id: "gallery", name: "Gallery", icon: "G", accent: "#40dfcf", description: "Photos, videos, albums, and memories.", component: GalleryApp },
  { id: "clock", name: "Clock", icon: "T", accent: "#a3e635", description: "World clocks, timers, alarms, and stopwatch.", component: ClockApp },
  { id: "camera", name: "Camera", icon: "K", accent: "#f4f1de", description: "Camera capture and future device integration.", component: CameraApp },
  { id: "settings", name: "Settings", icon: "S", accent: "#9bbcff", description: "Customize Nova and manage system preferences.", component: SettingsApp }
];
