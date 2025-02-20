import { Alert } from '@mui/material';
import ChatSdk, {
  Thread,
  ThreadIdOnExternalPlatform,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { FC, useEffect, useState } from 'react';
import { ChatWindow } from '../Chat/ChatWindow';

interface MessengerWindowProps {
  sdk: ChatSdk;
  threadId: ThreadIdOnExternalPlatform;
}

export const MessengerWindow: FC<MessengerWindowProps> = ({
  sdk,
  threadId,
}) => {
  const [thread, setThread] = useState<Thread | null>(null);

  useEffect(() => {
    const loadThread = async () => {
      const loadedThread = sdk.getThread(threadId);
      setThread(loadedThread);
    };

    loadThread();
  }, [sdk, threadId]);

  return (
    <div>
      <Alert icon={false} severity="success">
        Messenger
      </Alert>
      {thread ? (
        <div className="chat-container">
          <div className="chat-window">
            <ChatWindow sdk={sdk} thread={thread} />
          </div>
        </div>
      ) : null}
    </div>
  );
};
