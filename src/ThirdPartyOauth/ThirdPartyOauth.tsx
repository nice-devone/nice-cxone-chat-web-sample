import { useCallback, useRef, useState } from 'react';
import { Login } from './Login/Login';
import { STORAGE_CHAT_AUTHORIZATION_CODE } from '../constants';
import ChatSdk, {
  ChatSDKOptions,
  SecureSessions,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { ThirdPartyOauthChat } from './ThirdPartyOauthChat';

const chatSdkOptions: ChatSDKOptions = {
  brandId: Number(import.meta.env.REACT_APP_BRAND_ID as string),
  channelId: import.meta.env.REACT_APP_CHANNEL_ID as string,
  // use your environment from EnvironmentName enum
  environment: import.meta.env.REACT_APP_ENVIRONMENT,
  customEnvironment:
    import.meta.env.REACT_APP_ENVIRONMENT === 'custom'
      ? {
          authorize: import.meta.env.REACT_APP_CUSTOM_ENVIRONMENT_AUTHORIZE,
          chat: import.meta.env.REACT_APP_CUSTOM_ENVIRONMENT_CHAT,
          gateway: import.meta.env.REACT_APP_CUSTOM_ENVIRONMENT_GATEWAY,
          name: import.meta.env.REACT_APP_CUSTOM_ENVIRONMENT_NAME,
        }
      : undefined,
  isLivechat: true,
  securedSession: SecureSessions.THIRD_PARTY,
  cacheStorage: null,
  onError: (error) => {
    console.error('Chat SDK error:', error);
  },
  appName: 'Nice Chat SDK Demo',
};

export const ThirdPartyOauth = () => {
  const [authorizationCode, setAuthorizationCode] = useState(
    localStorage.getItem(STORAGE_CHAT_AUTHORIZATION_CODE),
  );
  const sdkRef = useRef<ChatSdk>(new ChatSdk(chatSdkOptions));
  const sdk = sdkRef.current;

  const handleLogin = useCallback((code: string) => {
    localStorage.clear(); // This should NOT be done in production. Resets the session for the new login (new customer).
    localStorage.setItem(STORAGE_CHAT_AUTHORIZATION_CODE, code); // Save the code for later use in sdk.authorize()
    setAuthorizationCode(code);
  }, []);

  // Show login screen if needed, otherwise continue to the app
  return !authorizationCode ? (
    <Login onLogin={handleLogin} />
  ) : (
    <ThirdPartyOauthChat sdk={sdk} authorizationCode={authorizationCode} />
  );
};
