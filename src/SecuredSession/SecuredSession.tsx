import ChatSdk, {
  CacheStorage,
  ChatSDKOptions,
  LivechatThread,
  SecureSessions,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { FC, useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { getThreadIdStorageKey } from '../Chat/utils/getThreadIdStorageKey';
import { isLivechat } from '../Livechat/isLivechat';
import { LivechatWindow } from '../Livechat/LivechatWindow';

async function getChatSdkOptions(): Promise<ChatSDKOptions> {
  const isThirdPartyCookiesSupported = document.hasStorageAccess
    ? await document.hasStorageAccess()
    : true; // OR other detection method depending on the SDK usage scenario

  // Initialize Chat SDK with required options
  const chatSdkOptions: ChatSDKOptions = {
    brandId: Number(import.meta.env.REACT_APP_BRAND_ID as string),
    channelId: import.meta.env.REACT_APP_CHANNEL_ID as string,
    // use your environment from  EnvironmentName enum
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
    // This needs to match Channel Authentication settings
    securedSession: SecureSessions.SECURED_COOKIES,
    // Use CacheStorage to speed up authentication process for known users
    cacheStorage: new CacheStorage(localStorage, 'CHAT_SDK_CACHE_'),
    // Allow long term storage
    storage: localStorage,
    // Essential detection for SECURED_COOKIES authentication, allows fallback flow
    isThirdPartyCookiesSupported,
    onError: (error) => {
      console.error('Chat SDK error:', error);
    },
    appName: 'Nice Chat SDK Demo',
  };

  return chatSdkOptions;
}

export const SecuredSession: FC = () => {
  const [sdk, setSdk] = useState<ChatSdk>();
  const [thread, setThread] = useState<LivechatThread | null>(null);

  // Retrieve SDK options and create ChatSdk instance
  useEffect(() => {
    getChatSdkOptions().then((options) => {
      const sdk = new ChatSdk(options);
      setSdk(sdk);
    });
  }, []);

  // try to load saved customer id and thread id
  useEffect(() => {
    if (!sdk) {
      return;
    }
    const loadThread = async () => {
      try {
        await sdk.connect();
      } catch (error) {
        console.error(error);
        alert('Connection failed. Please refresh.');
      }

      // get saved thread id or generate a new one
      const threadId =
        localStorage.getItem(getThreadIdStorageKey(sdk.channelId)) ??
        crypto?.randomUUID();

      const loadedThread = sdk.getThread(threadId);

      if (isLivechat(loadedThread)) {
        setThread(loadedThread);
        localStorage.setItem(getThreadIdStorageKey(sdk.channelId), threadId);
      } else {
        console.error('Loaded thread is not livechat instance');
      }
    };
    loadThread();
  }, [sdk]);

  if (!sdk || !thread) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  }

  return <LivechatWindow sdk={sdk} thread={thread} />;
};
