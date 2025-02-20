/// <reference types="vite/client" />

import { EnvironmentName } from '@nice-devone/nice-cxone-chat-web-sdk';

interface ImportMetaEnv {
  readonly REACT_APP_BRAND_ID: string;
  readonly REACT_APP_CHANNEL_ID: string;
  readonly REACT_APP_DEBUG_TOOLS_ENABLED: string;
  readonly REACT_APP_OAUTH_ENABLED: string;
  readonly REACT_APP_OAUTH_PROVIDER_URL: string;
  readonly REACT_APP_OAUTH_REDIRECT_URI: string;
  readonly REACT_APP_OAUTH_CLIENT_ID: string;
  readonly REACT_APP_VARIANT: string;
  readonly REACT_APP_ENVIRONMENT: EnvironmentName;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
