import { useEffect, useMemo, useRef, useState } from "react";
import type { NovaAppProps } from "../types/nova";
import { readImageFile } from "../core/SettingsManager/fileReaders";
import styles from "./BuiltInApps.module.css";

type Note = { id: string; title: string; body: string; updatedAt: string };
type NovaFile = { id: string; name: string; type: string; size: number; dataUrl: string; createdAt: string };
type CalendarEvent = { id: string; title: string; date: string; time: string };
type GalleryImage = { id: string; name: string; dataUrl: string };
type MusicTrack = { id: string; name: string; dataUrl: string };
type HistoryItem = { id: string; url: string; createdAt: string };

function useLocalState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const saved = window.localStorage.getItem(key);
    if (!saved) {
      return initialValue;
    }

    try {
      return JSON.parse(saved) as T;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

function makeId() {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

async function readAnyFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Could not read file."));
      }
    });
    reader.addEventListener("error", () => reject(new Error("Could not read file.")));
    reader.readAsDataURL(file);
  });
}

export function FilesApp() {
  const [files, setFiles] = useLocalState<NovaFile[]>("nova.files.items", []);
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  async function addFiles(fileList: FileList | null) {
    if (!fileList) {
      return;
    }

    const nextFiles = await Promise.all(
      Array.from(fileList).map(async (file) => ({
        id: makeId(),
        name: file.name,
        type: file.type || "Unknown",
        size: file.size,
        dataUrl: await readAnyFile(file),
        createdAt: new Date().toISOString()
      }))
    );
    setFiles((current) => [...nextFiles, ...current]);
  }

  return (
    <AppShell title="Files" subtitle={`${files.length} files, ${formatBytes(totalSize)} stored locally`}>
      <label className={styles.primaryButton}>
        Import files
        <input multiple type="file" onChange={(event) => void addFiles(event.target.files)} />
      </label>
      <div className={styles.list}>
        {files.map((file) => (
          <article key={file.id} className={styles.row}>
            <div>
              <strong>{file.name}</strong>
              <span>{file.type} · {formatBytes(file.size)}</span>
            </div>
            <a href={file.dataUrl} download={file.name}>Download</a>
            <button onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))} type="button">Delete</button>
          </article>
        ))}
        {!files.length ? <Empty text="Import files to create a local Nova file library." /> : null}
      </div>
    </AppShell>
  );
}

export function BrowserApp() {
  const [url, setUrl] = useState("https://example.com");
  const [currentUrl, setCurrentUrl] = useState("https://example.com");
  const [history, setHistory] = useLocalState<HistoryItem[]>("nova.browser.history", []);

  function visit() {
    const nextUrl = normalizeUrl(url);
    setCurrentUrl(nextUrl);
    setHistory((current) => [{ id: makeId(), url: nextUrl, createdAt: new Date().toISOString() }, ...current.slice(0, 24)]);
  }

  return (
    <AppShell title="Browser" subtitle="Browse embeddable pages and keep local history">
      <div className={styles.toolbar}>
        <input value={url} onChange={(event) => setUrl(event.target.value)} onKeyDown={(event) => event.key === "Enter" && visit()} />
        <button onClick={visit} type="button">Go</button>
      </div>
      <iframe className={styles.browserFrame} src={currentUrl} title="Nova Browser" sandbox="allow-same-origin allow-scripts allow-forms" />
      <h3>History</h3>
      <div className={styles.chips}>
        {history.map((item) => (
          <button key={item.id} onClick={() => { setUrl(item.url); setCurrentUrl(item.url); }} type="button">{item.url}</button>
        ))}
      </div>
    </AppShell>
  );
}

export function NotesApp() {
  const [notes, setNotes] = useLocalState<Note[]>("nova.notes.items", []);
  const [activeId, setActiveId] = useState<string | null>(notes[0]?.id ?? null);
  const activeNote = notes.find((note) => note.id === activeId) ?? null;

  function createNote() {
    const note = { id: makeId(), title: "Untitled note", body: "", updatedAt: new Date().toISOString() };
    setNotes((current) => [note, ...current]);
    setActiveId(note.id);
  }

  function updateNote(nextNote: Note) {
    setNotes((current) => current.map((note) => (note.id === nextNote.id ? { ...nextNote, updatedAt: new Date().toISOString() } : note)));
  }

  return (
    <AppShell title="Notes" subtitle={`${notes.length} saved notes`}>
      <button className={styles.primaryButton} onClick={createNote} type="button">New note</button>
      <div className={styles.split}>
        <aside className={styles.list}>
          {notes.map((note) => (
            <button key={note.id} className={styles.noteTab} data-active={note.id === activeId} onClick={() => setActiveId(note.id)} type="button">
              <strong>{note.title}</strong>
              <span>{new Date(note.updatedAt).toLocaleString()}</span>
            </button>
          ))}
        </aside>
        {activeNote ? (
          <section className={styles.editor}>
            <input value={activeNote.title} onChange={(event) => updateNote({ ...activeNote, title: event.target.value })} />
            <textarea value={activeNote.body} onChange={(event) => updateNote({ ...activeNote, body: event.target.value })} />
            <button onClick={() => setNotes((current) => current.filter((note) => note.id !== activeNote.id))} type="button">Delete note</button>
          </section>
        ) : (
          <Empty text="Create a note to start writing." />
        )}
      </div>
    </AppShell>
  );
}

export function CalculatorApp() {
  const [expression, setExpression] = useState("");
  const result = useMemo(() => {
    if (!expression || !/^[\d\s+\-*/().%]+$/.test(expression)) {
      return "";
    }

    try {
      const value = Function(`"use strict"; return (${expression.replace(/%/g, "/100")})`)();
      return typeof value === "number" && Number.isFinite(value) ? String(Number(value.toFixed(8))) : "";
    } catch {
      return "";
    }
  }, [expression]);

  const keys = ["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "%", "+"];

  return (
    <AppShell title="Calculator" subtitle="Expression calculator">
      <div className={styles.calculatorDisplay}>
        <input value={expression} onChange={(event) => setExpression(event.target.value)} placeholder="0" />
        <strong>{result || " "}</strong>
      </div>
      <div className={styles.calculatorKeys}>
        {keys.map((key) => <button key={key} onClick={() => setExpression((current) => current + key)} type="button">{key}</button>)}
        <button onClick={() => setExpression("")} type="button">Clear</button>
        <button onClick={() => setExpression((current) => current.slice(0, -1))} type="button">Delete</button>
        <button onClick={() => result && setExpression(result)} type="button">Equals</button>
      </div>
    </AppShell>
  );
}

export function CalendarApp() {
  const today = new Date().toISOString().slice(0, 10);
  const [events, setEvents] = useLocalState<CalendarEvent[]>("nova.calendar.events", []);
  const [draft, setDraft] = useState({ title: "", date: today, time: "09:00" });

  function addEvent() {
    if (!draft.title.trim()) {
      return;
    }
    setEvents((current) => [...current, { id: makeId(), ...draft }].sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`)));
    setDraft({ title: "", date: today, time: "09:00" });
  }

  return (
    <AppShell title="Calendar" subtitle={`${events.length} events`}>
      <div className={styles.toolbar}>
        <input placeholder="Event title" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        <input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} />
        <input type="time" value={draft.time} onChange={(event) => setDraft({ ...draft, time: event.target.value })} />
        <button onClick={addEvent} type="button">Add</button>
      </div>
      <div className={styles.list}>
        {events.map((event) => (
          <article key={event.id} className={styles.row}>
            <div><strong>{event.title}</strong><span>{event.date} at {event.time}</span></div>
            <button onClick={() => setEvents((current) => current.filter((item) => item.id !== event.id))} type="button">Delete</button>
          </article>
        ))}
      </div>
    </AppShell>
  );
}

export function GalleryApp() {
  const [images, setImages] = useLocalState<GalleryImage[]>("nova.gallery.images", []);

  async function addImages(fileList: FileList | null) {
    if (!fileList) {
      return;
    }
    const nextImages = await Promise.all(Array.from(fileList).map(async (file) => ({ id: makeId(), name: file.name, dataUrl: await readImageFile(file) })));
    setImages((current) => [...nextImages, ...current]);
  }

  return (
    <AppShell title="Gallery" subtitle={`${images.length} images`}>
      <label className={styles.primaryButton}>Import images<input accept="image/*" multiple type="file" onChange={(event) => void addImages(event.target.files)} /></label>
      <div className={styles.galleryGrid}>
        {images.map((image) => (
          <figure key={image.id}>
            <img src={image.dataUrl} alt={image.name} />
            <figcaption>{image.name}</figcaption>
            <button onClick={() => setImages((current) => current.filter((item) => item.id !== image.id))} type="button">Delete</button>
          </figure>
        ))}
      </div>
    </AppShell>
  );
}

export function MusicApp() {
  const [tracks, setTracks] = useLocalState<MusicTrack[]>("nova.music.tracks", []);

  async function addTracks(fileList: FileList | null) {
    if (!fileList) {
      return;
    }
    const nextTracks = await Promise.all(Array.from(fileList).map(async (file) => ({ id: makeId(), name: file.name, dataUrl: await readAnyFile(file) })));
    setTracks((current) => [...nextTracks, ...current]);
  }

  return (
    <AppShell title="Music" subtitle={`${tracks.length} tracks`}>
      <label className={styles.primaryButton}>Import audio<input accept="audio/*" multiple type="file" onChange={(event) => void addTracks(event.target.files)} /></label>
      <div className={styles.list}>
        {tracks.map((track) => (
          <article key={track.id} className={styles.track}>
            <strong>{track.name}</strong>
            <audio controls src={track.dataUrl} />
            <button onClick={() => setTracks((current) => current.filter((item) => item.id !== track.id))} type="button">Delete</button>
          </article>
        ))}
      </div>
    </AppShell>
  );
}

export function ClockApp() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [timerTarget, setTimerTarget] = useState(300);
  const [timerLeft, setTimerLeft] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!running) {
      return;
    }
    const interval = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(interval);
  }, [running]);

  useEffect(() => {
    if (!timerRunning || timerLeft <= 0) {
      return;
    }
    const interval = window.setInterval(() => {
      setTimerLeft((current) => {
        const nextValue = Math.max(0, current - 1);
        if (nextValue === 0) {
          setTimerRunning(false);
        }
        return nextValue;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [timerLeft, timerRunning]);

  return (
    <AppShell title="Clock" subtitle={new Date().toLocaleTimeString()}>
      <div className={styles.panelGrid}>
        <article><span>Stopwatch</span><strong>{formatTime(seconds)}</strong><button onClick={() => setRunning((value) => !value)} type="button">{running ? "Pause" : "Start"}</button><button onClick={() => { setRunning(false); setSeconds(0); }} type="button">Reset</button></article>
        <article><span>Timer</span><strong>{formatTime(timerLeft)}</strong><input type="number" min="1" value={Math.round(timerTarget / 60)} onChange={(event) => setTimerTarget(Number(event.target.value) * 60)} /><button onClick={() => { setTimerLeft(timerTarget); setTimerRunning(true); }} type="button">Start timer</button><button onClick={() => setTimerRunning(false)} type="button">Pause</button></article>
        <article><span>World</span><strong>{new Date().toLocaleTimeString([], { timeZone: "UTC" })}</strong><p>UTC</p></article>
      </div>
    </AppShell>
  );
}

export function CameraApp() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [photos, setPhotos] = useLocalState<GalleryImage[]>("nova.camera.photos", []);
  const [message, setMessage] = useState("Camera is ready when permission is allowed.");

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMessage("Camera active.");
    } catch {
      setMessage("Camera permission was denied or unavailable.");
    }
  }

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) {
      return;
    }
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhotos((current) => [{ id: makeId(), name: `Photo ${current.length + 1}`, dataUrl: canvas.toDataURL("image/png") }, ...current]);
  }

  return (
    <AppShell title="Camera" subtitle={message}>
      <div className={styles.camera}>
        <video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} hidden />
      </div>
      <div className={styles.toolbar}><button onClick={() => void startCamera()} type="button">Start camera</button><button onClick={capture} type="button">Capture</button></div>
      <div className={styles.galleryGrid}>
        {photos.map((photo) => <figure key={photo.id}><img src={photo.dataUrl} alt={photo.name} /><figcaption>{photo.name}</figcaption></figure>)}
      </div>
    </AppShell>
  );
}

function AppShell({ children, subtitle, title }: { children: React.ReactNode; subtitle: string; title: string }) {
  return (
    <section className={styles.app}>
      <header className={styles.header}><h2>{title}</h2><p>{subtitle}</p></header>
      {children}
    </section>
  );
}

function Empty({ text }: { text: string }) {
  return <p className={styles.empty}>{text}</p>;
}

function normalizeUrl(value: string) {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }
  return `https://${value}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
