/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_BACKEND_URL: string;
  // Add more env vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}