/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_NOVA_OWNER_CODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  nova?: {
    platform: string;
  };
}
