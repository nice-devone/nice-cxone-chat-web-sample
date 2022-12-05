import { ChatSdk, LivechatThread } from '@nice-devone/nice-cxone-chat-web-sdk';
import SDKControl from '../SDKControls/SDKControl';
import '../Chat/Chat.css';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { LivechatWindow } from './LivechatWindow';
import { Alert } from '@mui/material';

import { STORAGE_CHAT_CUSTOMER_ID } from '../Chat/User/constants';
import { isLivechat } from './isLivechat';

const STORAGE_CHAT_THREAD_ID = 'STORAGE_CHAT_THREAD_ID';

function getThreadIdStorageKey(channelId: string) {
  if (channelId === undefined) {
    throw new Error('ChannelId must be provided');
  }

  return `${STORAGE_CHAT_THREAD_ID}_${channelId}`;
}

const isDebugEnabled = Number(process.env.REACT_APP_DEBUG_TOOLS_ENABLED);

interface LivechatProps {
  sdk: ChatSdk;
}

export const Livechat = ({ sdk }: LivechatProps): JSX.Element => {
  const [thread, setThread] = useState<LivechatThread | null>(null);

  // try to load saved customer id and thread id
  useEffect(() => {
    const loadThread = async () => {
      let threadId = localStorage.getItem(getThreadIdStorageKey(sdk.channelId));

      try {
        const authResponse = await sdk.authorize();
        const customerId = authResponse?.consumerIdentity.idOnExternalPlatform;
        localStorage.setItem(STORAGE_CHAT_CUSTOMER_ID, customerId || '');
      } catch (error) {
        console.error(error);
      }

      if (!threadId) {
        threadId = `thread${Math.floor(Math.random() * 10000)}`;
      }
      const loadedThread = await sdk.getThread(threadId);
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

  return (
    <div>
      <Alert icon={false} severity="success">
        Livechat
      </Alert>
      <div className="chat-container">
        <div className="chat-window">
          <LivechatWindow sdk={sdk} thread={thread} />
        </div>
        {isDebugEnabled ? (
          <div className="chat-sdk">
            <SDKControl sdk={sdk} thread={thread} />
          </div>
        ) : null}
      </div>
    </div>
  );
};
