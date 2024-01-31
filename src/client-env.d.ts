/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_API: string;
  readonly VITE_GOOGLE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
