import { Message } from '@nice-devone/nice-cxone-chat-web-sdk';
import { useMemo } from 'react';
import { MessageItem } from '../MessageItem/MessageItem';
import { LoadMoreMessagesTrigger } from './LoadMoreMessagesTrigger/LoadMoreMessagesTrigger';
import './MessagesBoard.css';

interface MessagesBoardProps {
  messages: Map<string, Message>;
  loadMoreMessages: () => void;
}

export const MessagesBoard = ({
  messages,
  loadMoreMessages,
}: MessagesBoardProps): JSX.Element => {
  const messageArray = useMemo(
    () => Array.from(messages.values()),
    [messages.size],
  );

  return (
    <div className="messages-board">
      <LoadMoreMessagesTrigger onTrigger={loadMoreMessages} />
      {messageArray.map((message) => (
        <MessageItem message={message} key={message.id} />
      ))}
    </div>
  );
};
