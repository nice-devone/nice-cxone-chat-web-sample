import { Card, CardContent, CardHeader } from '@mui/material';
import './MessageItem.css';
import { getAuthor, Message } from '@nice-devone/nice-cxone-chat-web-sdk';
import { FC } from 'react';
import { MessageAttachments } from './MessageAttachments.tsx';
import { MessageText } from './MessageText.tsx';
import {
  MessageRichContent,
  Postback,
} from '../MessageRichContent/MessageRichContent.tsx';

interface MessageItemProps {
  message: Message;
  onAction: (postback: Postback) => void;
}

export const MessageItem: FC<MessageItemProps> = ({ message, onAction }) => {
  return (
    <div
      className={`message-item ${
        message.direction === 'outbound'
          ? 'message-item__outbound'
          : 'message-item__inbound'
      }`}
    >
      <Card
        className="message-item-card"
        data-testid="message-item"
        data-id={message.id}
      >
        <CardHeader
          subheader={getAuthor(message)}
          subheaderTypographyProps={{ fontSize: '12px' }}
        />
        <CardContent>
          <MessageAttachments attachments={message.attachments} />
          <MessageText text={message.messageContent.payload.text} />
          <MessageRichContent message={message} onAction={onAction} />
        </CardContent>
        <CardHeader
          subheader={new Date(message.createdAt).toLocaleString()}
          subheaderTypographyProps={{ fontSize: '12px' }}
        />
      </Card>
    </div>
  );
};
