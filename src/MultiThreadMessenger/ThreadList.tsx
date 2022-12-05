import { ThreadListItem } from './ThreadListItem';
import {
  IThread,
  LoadThreadMetadataChatEvent,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import List from '@mui/material/List';
import { ListItemText } from '@mui/material';
import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import OfflinePinIcon from '@mui/icons-material/OfflinePin';

interface ThreadListProps {
  threads: Array<IThread>;
  onThreadSelect: (id: string) => void;
  onThreadArchive: (id: string) => Promise<void>;
  onThreadNameChange: (id: string, name: string) => void;
  getThreadMetadata?: (
    id: string,
  ) => Promise<LoadThreadMetadataChatEvent | null>;
}

export function ThreadList({
  threads,
  onThreadArchive,
  onThreadSelect,
  onThreadNameChange,
  getThreadMetadata,
}: ThreadListProps): JSX.Element | null {
  return (
    <List>
      <ListItemText primary="List of available threads" />
      <ThreadListItem
        name="Start new thread"
        id=""
        onThreadSelect={onThreadSelect}
        onThreadArchive={onThreadArchive}
        icon={MapsUgcIcon}
      />
      {threads.map((thread) => {
        return (
          <ThreadListItem
            key={thread.id}
            name={thread.threadName}
            id={thread.idOnExternalPlatform}
            onThreadSelect={onThreadSelect}
            onThreadArchive={onThreadArchive}
            onEdit={onThreadNameChange}
            icon={thread.canAddMoreMessages ? undefined : OfflinePinIcon}
            isArchived={thread.canAddMoreMessages === false}
            getThreadMetadata={getThreadMetadata}
          />
        );
      })}
    </List>
  );
}
