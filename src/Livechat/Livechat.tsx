import {
  ChatSdk,
  ChatSDKOptions,
  LivechatThread,
  SecureSessions,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import '../Chat/Chat.css';
import { FC, useEffect, useRef, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { LivechatWindow } from './LivechatWindow';
import { Alert } from '@mui/material';

import {
  STORAGE_CHAT_AUTHORIZATION_CODE,
  STORAGE_CHAT_CUSTOMER_ID,
} from '../constants';
import { isLivechat } from './isLivechat';
import { getThreadIdStorageKey } from '../Chat/utils/getThreadIdStorageKey';

const chatSdkOptions: ChatSDKOptions = {
  brandId: Number(import.meta.env.REACT_APP_BRAND_ID as string),
  channelId: import.meta.env.REACT_APP_CHANNEL_ID as string,
  customerId:
    localStorage.getItem(STORAGE_CHAT_CUSTOMER_ID) || crypto?.randomUUID(),
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
  securedSession: SecureSessions.ANONYMOUS,
  cacheStorage: null,
  storage: null,
  onError: (error) => {
    console.error('Chat SDK error:', error);
  },
  appName: 'Nice Chat SDK Demo',
};

export const Livechat: FC = () => {
  const [thread, setThread] = useState<LivechatThread | null>(null);
  const sdkRef = useRef<ChatSdk>(new ChatSdk(chatSdkOptions));
  const sdk = sdkRef.current;

  // try to load saved customer id and thread id
  useEffect(() => {
    const loadThread = async () => {
      let threadId = localStorage.getItem(getThreadIdStorageKey(sdk.channelId));
      try {
        await sdk.connect();
        const customerId = sdk.getCustomer()?.getId();
        if (customerId) {
          localStorage.setItem(STORAGE_CHAT_CUSTOMER_ID, customerId || '');
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_CHAT_AUTHORIZATION_CODE);
        console.error(error);
        alert('Authorization failed. Please refresh.');
      }

      if (!threadId) {
        threadId = crypto?.randomUUID();
      }
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

  if (!thread) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Alert icon={false} severity="success">
        Livechat
      </Alert>
      <div className="chat-container">
        <div className="chat-window">
          <LivechatWindow sdk={sdk} thread={thread} />
        </div>
      </div>
    </div>
  );
};
