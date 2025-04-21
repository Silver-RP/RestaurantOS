/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_API_AUTH_URL: string;
    // Add more env vars here if needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  