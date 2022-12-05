import {
  ChatSdk,
  ChatEvent,
  Message as ChatMessage,
  ChatEventData,
  isMessageCreatedEvent,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { useCallback, useEffect, useState } from 'react';

interface MessagesProps {
  sdk: ChatSdk;
  threadId: string;
}

interface Message {
  id: string;
  messageContent: {
    text: string;
  };
}

export const Messages = ({ sdk, threadId }: MessagesProps): JSX.Element => {
  const [messages, setMessages] = useState<Message[]>([]);

  const recoverChat = useCallback(async () => {
    // recover chat
    const thread = sdk.getThread(threadId);
    try {
      const recoverResponse = await thread.recover();
      const recoveredMessages = recoverResponse.messages;

      setMessages(() => {
        return recoveredMessages.map((message: ChatMessage) => ({
          id: message.id,
          messageContent: {
            text: message.messageContent.text,
          },
        }));
      });
    } catch (error) {
      console.error(error);
    }
  }, [sdk, threadId]);

  const handleMessageCreated = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (!isMessageCreatedEvent(event.detail)) {
        return;
      }

      const message = event.detail.data.message;

      setMessages((storedMessages) => {
        return [...storedMessages, message];
      });
    },
    [],
  );

  useEffect(() => {
    sdk.onChatEvent(ChatEvent.MESSAGE_CREATED, handleMessageCreated);
  }, [handleMessageCreated, sdk]);

  return (
    <div>
      <h2>Recover</h2>
      <button onClick={recoverChat}>Recover chat</button>
      <h2>Messages</h2>
      {messages.map((message) => (
        <div key={message.id}>{message.messageContent?.text}</div>
      ))}
    </div>
  );
};
