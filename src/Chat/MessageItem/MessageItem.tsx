import { Card, CardContent, CardHeader } from '@mui/material';
import './MessageItem.css';
import { Message, getAuthor } from '@nice-devone/nice-cxone-chat-web-sdk';

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
        <CardContent>{message.messageContent.text}</CardContent>
        <CardHeader
          subheader={new Date(message.createdAt).toLocaleString()}
          subheaderTypographyProps={{ fontSize: '12px' }}
        />
      </Card>
    </div>
  );
};
