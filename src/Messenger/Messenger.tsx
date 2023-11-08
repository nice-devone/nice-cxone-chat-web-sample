import { ChatSdk, Thread } from '@nice-devone/nice-cxone-chat-web-sdk';
import SDKControl from '../SDKControls/SDKControl';
import { ChatWindow } from '../Chat/ChatWindow';
import '../Chat/Chat.css';
import { useEffect, useState } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { STORAGE_CHAT_CUSTOMER_ID } from '../constants';
import { getThreadIdStorageKey } from '../Chat/utils/getThredIdStorageKey';
import { Alert } from '@mui/material';

const isDebugEnabled = Number(process.env.REACT_APP_DEBUG_TOOLS_ENABLED);

interface MessengerProps {
  sdk: ChatSdk;
}

export const Messenger = ({ sdk }: MessengerProps): JSX.Element => {
  const [thread, setThread] = useState<Thread | null>(null);

  // try to load saved customer id and thread id
  useEffect(() => {
    const loadThread = async () => {
      let threadId = localStorage.getItem(getThreadIdStorageKey(sdk.channelId));

      try {
        await sdk.authorize();
        const customerId = sdk.getCustomer()?.getId();
        if (customerId) {
          localStorage.setItem(STORAGE_CHAT_CUSTOMER_ID, customerId || '');
        }
      } catch (error) {
        console.error(error);
      }

      if (!threadId) {
        threadId = crypto?.randomUUID();
      }

      const loadedThread = sdk.getThread(threadId);
      setThread(loadedThread);
      localStorage.setItem(getThreadIdStorageKey(sdk.channelId), threadId);
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
        Messenger
      </Alert>
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
    </div>
  );
};
