import {
  ChatSdk,
  ThreadView,
  LoadThreadMetadataChatEvent,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import '../Chat/Chat.css';
import { useEffect, useState } from 'react';
import BackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import { ThreadList } from './ThreadList';
import { Messenger } from '../Messenger/Messenger';
import { Link } from '@mui/material';
import { getThreadIdStorageKey } from '../Chat/utils/getThredIdStorageKey';

interface MultiThreadMessengerProps {
  sdk: ChatSdk;
}

export const MultiThreadMessenger = ({
  sdk,
}: MultiThreadMessengerProps): JSX.Element => {
  const [threadList, setThreadList] = useState<Array<ThreadView> | null>(null);
  const [selectedThread, selectThread] = useState<string | null>(null);

  const handleLoadThreadList = () => {
    const loadThreadList = async () => {
      try {
        const threads = await sdk.getThreadList();
        setThreadList(threads ?? []);
      } catch (error: unknown) {
        console.error(error);
      }
    };
    loadThreadList();
  };

  const handleThreadSelect = (idOnExternalPlatform: string) => {
    localStorage.setItem(
      getThreadIdStorageKey(sdk.channelId),
      idOnExternalPlatform,
    );
    selectThread(idOnExternalPlatform);
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
    selectThread(null);
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

  // try to load saved customer id and thread id
  useEffect(() => {
    handleLoadThreadList();
  }, []);

  if (!threadList) {
    return (
      <div className="loader">
        <CircularProgress />
      </div>
    );
  }

  if (selectedThread !== null) {
    return (
      <div>
        <div>
          <Link onClick={handleBackClick} className="multithread-back-link">
            <BackIcon /> Back to thread list
          </Link>
        </div>

        <Messenger sdk={sdk} />
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
