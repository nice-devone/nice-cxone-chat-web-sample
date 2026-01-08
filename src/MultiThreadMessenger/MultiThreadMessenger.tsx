import {
  ChatSdk,
  ThreadView,
  LoadThreadMetadataChatEvent,
  SecureSessions,
  ChatSDKOptions,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import '../Chat/Chat.css';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import BackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import { ThreadList } from './ThreadList';
import { Link } from '@mui/material';
import { getThreadIdStorageKey } from '../Chat/utils/getThreadIdStorageKey';
import { STORAGE_CHAT_CUSTOMER_ID } from '../constants';
import { MessengerWindow } from '../Messenger/MessengerWindow';

// Initialize Chat SDK with required options
const chatSdkOptions: ChatSDKOptions = {
  brandId: Number(import.meta.env.REACT_APP_BRAND_ID as string),
  channelId: import.meta.env.REACT_APP_CHANNEL_ID as string,
  customerId: localStorage.getItem(STORAGE_CHAT_CUSTOMER_ID) || '',
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
  securedSession: SecureSessions.ANONYMOUS,
  cacheStorage: null,
  storage: null,
  onError: (error) => {
    console.error('Chat SDK error:', error);
  },
  appName: 'Nice Chat SDK Demo',
};

export const MultiThreadMessenger: FC = () => {
  const [threadList, setThreadList] = useState<Array<ThreadView> | null>(null);
  const [selectedThreadId, selectThreadId] = useState<string | null>(null);
  const sdkRef = useRef<ChatSdk>(new ChatSdk(chatSdkOptions));
  const sdk = sdkRef.current;

  const handleLoadThreadList = useCallback(() => {
    const loadThreadList = async () => {
      try {
        sdk.connect();
        const threads = await sdk.getThreadList();
        setThreadList(threads ?? []);
      } catch (error: unknown) {
        console.error(error);
      }
    };
    loadThreadList();
  }, [sdk]);

  // try to load saved customer id and thread id
  useEffect(() => {
    handleLoadThreadList();
  }, [handleLoadThreadList]);

  const handleThreadSelect = (idOnExternalPlatform: string) => {
    localStorage.setItem(
      getThreadIdStorageKey(sdk.channelId),
      idOnExternalPlatform,
    );
    selectThreadId(idOnExternalPlatform);
  };

  const handleThreadArchive = async (idOnExternalPlatform: string) => {
    const thread = sdk.getThread(idOnExternalPlatform);
    try {
      await thread.archive();
      handleLoadThreadList();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const handleLoadThreadMetadata = async (
    idOnExternalPlatform: string,
  ): Promise<LoadThreadMetadataChatEvent | null> => {
    const thread = sdk.getThread(idOnExternalPlatform);
    try {
      return await thread.getMetadata();
    } catch (error: unknown) {
      console.error(error);
      return null;
    }
  };

  const handleBackClick = () => {
    localStorage.setItem(getThreadIdStorageKey(sdk.channelId), '');
    selectThreadId(null);
    handleLoadThreadList();
  };

  const handleThreadNameChange = async (
    idOnExternalPlatform: string,
    name: string,
  ) => {
    const thread = sdk.getThread(idOnExternalPlatform);
    if (thread) {
      const result = await thread.setName(name);

      if (result) {
        handleLoadThreadList();
      } else {
        console.error('Thread name change failed');
      }
    }
  };

  if (!threadList) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  }

  if (selectedThreadId !== null) {
    return (
      <div>
        <div>
          <Link onClick={handleBackClick} className="multithread-back-link">
            <BackIcon /> Back to thread list
          </Link>
        </div>

        <MessengerWindow sdk={sdk} threadId={selectedThreadId} />
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-window">
        <ThreadList
          threads={threadList}
          onThreadSelect={handleThreadSelect}
          onThreadArchive={handleThreadArchive}
          onThreadNameChange={handleThreadNameChange}
          getThreadMetadata={handleLoadThreadMetadata}
        />
      </div>
    </div>
  );
};
