/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_AUTH_URL: string;
    // Add more env vars here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  