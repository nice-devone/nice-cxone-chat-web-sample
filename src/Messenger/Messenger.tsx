import { ChatSdk, Thread } from '@nice-devone/nice-cxone-chat-web-sdk';
import SDKControl from '../SDKControls/SDKControl';
import { ChatWindow } from '../Chat/ChatWindow';
import '../Chat/Chat.css';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { STORAGE_CHAT_CUSTOMER_ID } from '../Chat/User/constants';

const STORAGE_CHAT_THREAD_ID = 'STORAGE_CHAT_THREAD_ID';

const isDebugEnabled = Number(process.env.REACT_APP_DEBUG_TOOLS_ENABLED);

interface MessengerProps {
  sdk: ChatSdk;
}

export const Messenger = ({ sdk }: MessengerProps): JSX.Element => {
  const [thread, setThread] = useState<Thread | null>(null);

  // try to load saved customer id and thread id
  useEffect(() => {
    const loadThread = async () => {
      let threadId = localStorage.getItem(STORAGE_CHAT_THREAD_ID);

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
      setThread(loadedThread);
      localStorage.setItem(STORAGE_CHAT_THREAD_ID, threadId);
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
    <div className="chat-container">
      <div className="chat-window">
        <ChatWindow sdk={sdk} thread={thread} />
      </div>
      {isDebugEnabled ? (
        <div className="chat-sdk">
          <SDKControl sdk={sdk} thread={thread} />
        </div>
      ) : null}
    </div>
  );
};
