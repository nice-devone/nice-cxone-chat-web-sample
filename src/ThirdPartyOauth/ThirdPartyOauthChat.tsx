import ChatSdk, {
  LivechatThread,
  Thread,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { FC, useEffect, useState } from 'react';
import { LivechatWindow } from '../Livechat/LivechatWindow';
import { getThreadIdStorageKey } from '../Chat/utils/getThreadIdStorageKey';
import CircularProgress from '@mui/material/CircularProgress';

export interface ThirdPartyOauthChatProps {
  sdk: ChatSdk;
  authorizationCode: string;
}

export const ThirdPartyOauthChat: FC<ThirdPartyOauthChatProps> = ({
  authorizationCode,
  sdk,
}) => {
  const [thread, setThread] = useState<LivechatThread | Thread | null>(null);
  // connect sdk and load thread
  useEffect(() => {
    const connectSdk = async () => {
      try {
        await sdk.connect(authorizationCode);
        const threadId =
          localStorage.getItem(getThreadIdStorageKey(sdk.channelId)) ??
          crypto?.randomUUID();

        const loadedThread = sdk.getThread(threadId);
        setThread(loadedThread);
        localStorage.setItem(getThreadIdStorageKey(sdk.channelId), threadId);
      } catch (error) {
        console.error(error);
      }
    };

    connectSdk();
  }, [authorizationCode, sdk]);

  if (!thread) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="chat-window">
      <LivechatWindow sdk={sdk} thread={thread} />
    </div>
  );
};
