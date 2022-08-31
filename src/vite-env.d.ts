/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOGGER_IS_ENABLED: string;
  readonly VITE_API_ENDPOINT: string;
  readonly VITE_PROJECT_ID: string;
  readonly VITE_DATABASE_ID: string;
  readonly VITE_COLLECTION_NOTES: string;
  readonly VITE_COLLECTION_BLOCK_CONTENTS: string;
  readonly VITE_COLLECTION_SETTINGS: string;
  readonly VITE_TEST_USER_EMAIL: string;
  readonly VITE_TEST_USER_PASSWORD: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
