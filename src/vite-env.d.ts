/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOGGER_IS_ENABLED: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
