import {
  ChatSdk,
  ChatSDKOptions,
  SecureSessions,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import '../Chat/Chat.css';
import { FC, useEffect, useRef, useState } from 'react';
import {
  STORAGE_CHAT_AUTHORIZATION_CODE,
  STORAGE_CHAT_CUSTOMER_ID,
} from '../constants';
import { getThreadIdStorageKey } from '../Chat/utils/getThreadIdStorageKey';
import { MessengerWindow } from './MessengerWindow';

// Initialize Chat SDK with required options
const chatSdkOptions: ChatSDKOptions = {
  brandId: Number(import.meta.env.REACT_APP_BRAND_ID as string),
  channelId: import.meta.env.REACT_APP_CHANNEL_ID as string,
  customerId:
    localStorage.getItem(STORAGE_CHAT_CUSTOMER_ID) || crypto?.randomUUID(),
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
  isLivechat: false,
  securedSession: SecureSessions.ANONYMOUS,
  cacheStorage: null,
  storage: null,
  onError: (error) => {
    console.error('Chat SDK error:', error);
  },
  appName: 'Nice Chat SDK Demo',
};

export const Messenger: FC = () => {
  const sdkRef = useRef<ChatSdk>(new ChatSdk(chatSdkOptions));
  const sdk = sdkRef.current;
  const threadId =
    localStorage.getItem(getThreadIdStorageKey(sdk.channelId)) ??
    crypto?.randomUUID();

  const [sdkReady, setReady] = useState<boolean>(false);

  useEffect(() => {
    const initializeSdk = async () => {
      try {
        await sdk.connect();
        setReady(true);
      } catch (error: unknown) {
        console.error('Failed to initialize SDK:', error);
      }
    };
    initializeSdk();
  }, [sdk]);

  // try to load saved customer id and thread id
  useEffect(() => {
    const loadThread = async () => {
      try {
        const customerId = sdk.getCustomer()?.getId();
        if (customerId) {
          localStorage.setItem(STORAGE_CHAT_CUSTOMER_ID, customerId || '');
        }
      } catch (error) {
        localStorage.removeItem(STORAGE_CHAT_AUTHORIZATION_CODE);
        console.error(error);
        alert('Authorization failed. Please refresh.');
      }

      localStorage.setItem(getThreadIdStorageKey(sdk.channelId), threadId);
    };

    if (!sdkReady) {
      return;
    }

    loadThread();
  }, [sdk, threadId, sdkReady]);

  if (!sdkReady) {
    return null;
  }

  return <MessengerWindow sdk={sdk} threadId={threadId} />;
};
