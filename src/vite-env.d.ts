/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIGMA_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
