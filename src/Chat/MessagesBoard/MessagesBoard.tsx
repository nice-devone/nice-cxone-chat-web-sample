import { isMessage, Message } from '@nice-devone/nice-cxone-chat-web-sdk';
import { FC, useMemo } from 'react';
import { MessageItem } from '../MessageItem/MessageItem';
import { LoadMoreMessagesTrigger } from './LoadMoreMessagesTrigger/LoadMoreMessagesTrigger';
import { SystemMessage } from '../SystemMessage/SystemMessage';
import './MessagesBoard.css';

interface MessagesBoardProps {
  messages: Map<string, Message | SystemMessage>;
  loadMoreMessages: () => void;
}

export const MessagesBoard: FC<MessagesBoardProps> = ({
  messages,
  loadMoreMessages,
}) => {
  const messageArray = useMemo(
    () => Array.from(messages.values()),
    [messages.size],
  );

  return (
    <div className="messages-board">
      <LoadMoreMessagesTrigger onTrigger={loadMoreMessages} />
      {messageArray
        .map((message) =>
          isMessage(message) ? (
            <MessageItem message={message} key={message.id} />
          ) : (
            <SystemMessage message={message} key={message.id} />
          ),
        )
        .filter(Boolean)}
    </div>
  );
};
