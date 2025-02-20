import {
  ChatSdk,
  ChatSDKOptions,
  SecureSessions,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import '../Chat/Chat.css';
import { FC, useEffect, useRef } from 'react';
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
  customerId: localStorage.getItem(STORAGE_CHAT_CUSTOMER_ID) || '',
  // use your environment from  EnvironmentName enum
  environment: import.meta.env.REACT_APP_ENVIRONMENT,
  isLivechat: false,
  securedSession: SecureSessions.ANONYMOUS,
  cacheStorage: null,
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

  // try to load saved customer id and thread id
  useEffect(() => {
    const loadThread = async () => {
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

      localStorage.setItem(getThreadIdStorageKey(sdk.channelId), threadId);
    };

    loadThread();
  }, [sdk, threadId]);

  return <MessengerWindow sdk={sdk} threadId={threadId} />;
};
