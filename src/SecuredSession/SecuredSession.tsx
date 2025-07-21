import ChatSdk, {
  ChatSDKOptions,
  LivechatThread,
  SecureSessions,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { FC, useEffect, useRef, useState } from 'react';
import { CircularProgress } from '@mui/material';
import { getThreadIdStorageKey } from '../Chat/utils/getThreadIdStorageKey';
import { isLivechat } from '../Livechat/isLivechat';
import { LivechatWindow } from '../Livechat/LivechatWindow';

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
  securedSession: SecureSessions.SECURED_COOKIES,
  cacheStorage: null,
  onError: (error) => {
    console.error('Chat SDK error:', error);
  },
  appName: 'Nice Chat SDK Demo',
};

export const SecuredSession: FC = () => {
  const [thread, setThread] = useState<LivechatThread | null>(null);
  const sdkRef = useRef<ChatSdk>(new ChatSdk(chatSdkOptions));
  const sdk = sdkRef.current;

  // try to load saved customer id and thread id
  useEffect(() => {
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
  }, []);

  if (!thread) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  }

  return <LivechatWindow sdk={sdk} thread={thread} />;
};
