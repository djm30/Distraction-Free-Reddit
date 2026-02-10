/// <reference types="vite/client" />

// Declare custom environment variables
interface ImportMetaEnv {
  readonly VITE_BROWSER: 'chrome' | 'firefox';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
