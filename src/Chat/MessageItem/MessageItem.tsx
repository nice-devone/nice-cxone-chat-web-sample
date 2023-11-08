import {
  Card,
  CardContent,
  CardHeader,
  ImageList,
  ImageListItem,
  Typography,
} from '@mui/material';
import './MessageItem.css';
import {
  Attachment,
  Message,
  getAuthor,
} from '@nice-devone/nice-cxone-chat-web-sdk';

interface MessageAttachmentsProps {
  attachments: Array<Attachment> | undefined;
}

const MessageAttachments = ({ attachments }: MessageAttachmentsProps) => {
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
          <img src={item.previewUrl} alt={item.friendlyName} loading="lazy" />
        </ImageListItem>
      ))}
    </ImageList>
  );
};
interface MessageTextProps {
  text: string;
}

const MessageText = ({ text }: MessageTextProps) => {
  if (!text.length) {
    return null;
  }

  return <Typography variant="body1">{text}</Typography>;
};

interface MessageItemProps {
  message: Message;
}
export const MessageItem = ({ message }: MessageItemProps): JSX.Element => {
  return (
    <div
      className={`message-item ${
        message.direction === 'outbound'
          ? 'message-item__outbound'
          : 'message-item__inbound'
      }`}
    >
      <Card className="message-item-card">
        <CardHeader
          subheader={getAuthor(message)}
          subheaderTypographyProps={{ fontSize: '12px' }}
        />
        <CardContent>
          <MessageAttachments attachments={message.attachments} />
          <MessageText text={message.messageContent.payload.text} />
        </CardContent>
        <CardHeader
          subheader={new Date(message.createdAt).toLocaleString()}
          subheaderTypographyProps={{ fontSize: '12px' }}
        />
      </Card>
    </div>
  );
};
