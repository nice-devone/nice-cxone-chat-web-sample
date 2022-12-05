import { ComponentType, SyntheticEvent, useEffect, useState } from 'react';
import { LoadThreadMetadataChatEvent } from '@nice-devone/nice-cxone-chat-web-sdk';
import { IconButton, ListItemText } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ArchiveIcon from '@mui/icons-material/Archive';
import EditIcon from '@mui/icons-material/Edit';

interface ThreadListItemProps {
  id: string;
  name: string;
  onThreadSelect: (idOnExternalPlatform: string) => void;
  onThreadArchive: (idOnExternalPlatform: string) => Promise<void>;
  onEdit?: (id: string, name: string) => void;
  icon?: ComponentType;
  isArchived?: boolean;
  getThreadMetadata?: (
    id: string,
  ) => Promise<LoadThreadMetadataChatEvent | null>;
}

export function ThreadListItem({
  id,
  name,
  onThreadSelect,
  onThreadArchive,
  onEdit,
  icon: Icon = QuestionAnswerIcon,
  isArchived,
  getThreadMetadata,
}: ThreadListItemProps): JSX.Element {
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  // try to load thread metadata
  useEffect(() => {
    const getMetadata = async () => {
      try {
        if (typeof getThreadMetadata === 'function') {
          const response = await getThreadMetadata(id);
          if (
            response !== null &&
            response.data.lastMessage.messageContent.type === 'TEXT'
          ) {
            setLastMessage(response.data.lastMessage.messageContent.text);
          }
        }
      } catch (error: unknown) {
        console.error(error);
      }
    };

    getMetadata();
  }, []);

  const handleEdit = () => {
    if (onEdit) {
      const input = window.prompt('Enter thread name', name);
      onEdit(id, input ?? name);
    }
  };

  const editBtn = onEdit ? (
    <IconButton aria-label="Edit name" onClick={handleEdit}>
      <EditIcon />
    </IconButton>
  ) : null;

  return (
    <ListItem key={id} secondaryAction={editBtn}>
      <ListItemButton
        onClick={(e) => {
          e.preventDefault();
          onThreadSelect(id);
        }}
      >
        <ListItemIcon>
          <Icon />
        </ListItemIcon>
        <ListItemText primary={name || id} secondary={lastMessage} />
        {isArchived === false ? (
          <IconButton
            component="label"
            onClick={(e: SyntheticEvent): void => {
              e.preventDefault();
              e.stopPropagation();
              onThreadArchive(id);
            }}
          >
            <ArchiveIcon />
          </IconButton>
        ) : null}
      </ListItemButton>
    </ListItem>
  );
}
