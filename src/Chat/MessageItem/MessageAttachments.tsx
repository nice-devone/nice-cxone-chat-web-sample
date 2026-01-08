import { Attachment } from '@nice-devone/nice-cxone-chat-web-sdk';
import { ImageList, ImageListItem } from '@mui/material';
import { FC } from 'react';

interface MessageAttachmentsProps {
  attachments: Array<Attachment> | undefined;
}

export const MessageAttachments: FC<MessageAttachmentsProps> = ({
  attachments,
}) => {
  if (!attachments?.length) {
    return null;
  }

  const attachmentImages: Array<Attachment> = [];
  attachments.forEach((attachmentItem) => {
    if (attachmentItem.mimeType.includes('image')) {
      attachmentImages.push(attachmentItem);
    }
  });

  return (
    <ImageList cols={attachmentImages.length}>
      {attachmentImages.map((item: Attachment) => (
        <ImageListItem key={item.id}>
          <img
            src={item.previewUrl || item.url}
            alt={item.friendlyName}
            loading="lazy"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
