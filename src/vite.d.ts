/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BROWSER: string;
  readonly IS_CHROMIUM: boolean;
  readonly VERSION: string;
}

interface Settings {
  showIcon: boolean;
  autoExpandAll: boolean;
  includeIcon: boolean;
  includeDate: boolean;
  noOtherBookmarks: boolean;
  noParentFolders: boolean;
}
