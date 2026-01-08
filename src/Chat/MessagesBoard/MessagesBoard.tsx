import { isMessage, Message } from '@nice-devone/nice-cxone-chat-web-sdk';
import { FC, useMemo } from 'react';
import { MessageItem } from '../MessageItem/MessageItem';
import { LoadMoreMessagesTrigger } from './LoadMoreMessagesTrigger/LoadMoreMessagesTrigger';
import { SystemMessage } from '../SystemMessage/SystemMessage';
import './MessagesBoard.css';
import { Postback } from '../MessageRichContent/MessageRichContent.tsx';

interface MessagesBoardProps {
  messages: Map<string, Message | SystemMessage>;
  loadMoreMessages: () => void;
  onPostback: (postback: Postback) => void;
}

export const MessagesBoard: FC<MessagesBoardProps> = ({
  messages,
  loadMoreMessages,
  onPostback,
}) => {
  const messageArray = useMemo(() => Array.from(messages.values()), [messages]);

  return (
    <div className="messages-board">
      <LoadMoreMessagesTrigger onTrigger={loadMoreMessages} />
      {messageArray
        .map((message) =>
          isMessage(message) ? (
            <MessageItem
              message={message}
              key={message.id}
              onAction={onPostback}
            />
          ) : (
            <SystemMessage message={message} key={message.id} />
          ),
        )
        .filter(Boolean)}
    </div>
  );
};
