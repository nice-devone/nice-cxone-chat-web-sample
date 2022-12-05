import { useCallback, useEffect, useState } from 'react';

import {
  ChatSdk,
  Thread,
  LivechatThread,
  Message,
  ChatEvent,
  ChatEventData,
  AssignedAgentChangedData,
  isMessageCreatedEvent,
} from '@nice-devone/nice-cxone-chat-web-sdk';

import { MessagesBoard } from './MessagesBoard/MessagesBoard';
import { SendMessageForm } from './SendMessageForm/SendMessageForm';
import { User } from './User/User';
import { useWindowFocus } from '../hooks/focus';
import { parseAgentName } from './Agent/agentName';
import { Typography } from '@mui/material';
import { mergeMessages } from '../state/messages/mergeMessages';

interface ChatWindowProps {
  sdk: ChatSdk;
  thread: Thread | LivechatThread;
}

export const ChatWindow = ({ sdk, thread }: ChatWindowProps): JSX.Element => {
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const [userName, setUserName] = useState<string>(
    localStorage.getItem('userName') ?? '',
  );
  const windowFocus = useWindowFocus();
  const [agentName, setAgentName] = useState<string | null>(null);

  // Recover thread
  useEffect(() => {
    sdk.getCustomer()?.setName(localStorage.getItem('userName') ?? '');

    const recover = async () => {
      try {
        const recoverResponse = await thread.recover();
        const recoveredMessages =
          recoverResponse.messages.reverse() as Message[];
        setMessages((messages) => mergeMessages(messages, recoveredMessages));
        setAgentName(parseAgentName(recoverResponse.inboxAssignee));
      } catch (error) {
        console.error(error);
      }
    };

    recover();
  }, [thread]);

  // Attach ChatEvent listeners
  useEffect(() => {
    const removeMessageCreatedEventListener = thread.onThreadEvent(
      ChatEvent.MESSAGE_CREATED,
      handleMessageAdded,
    );
    const removeAssignedAgentChangedListener = sdk.onChatEvent(
      ChatEvent.ASSIGNED_AGENT_CHANGED,
      handleAssignedAgentChangeEvent,
    );

    return () => {
      removeMessageCreatedEventListener();
      removeAssignedAgentChangedListener();
    };
  }, []);

  // Mark all messages as read on focus
  useEffect(() => {
    if (windowFocus) {
      thread.lastMessageSeen().catch((error) => console.error(error));
    }
  }, [thread, messages, windowFocus]);

  const handleMessageAdded = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (!isMessageCreatedEvent(event.detail)) {
        return;
      }
      const message = event.detail.data.message;

      setMessages(
        (messages) =>
          new Map<string, Message>(messages.set(message.id, message)),
      );
    },
    [],
  );

  const handleAssignedAgentChangeEvent = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      setAgentName(
        parseAgentName(
          (event.detail.data as AssignedAgentChangedData).inboxAssignee,
        ),
      );
    },
    [],
  );

  const handleInputUserNameChanged = useCallback((newUserName: string) => {
    localStorage.setItem('userName', newUserName);
    setUserName(newUserName);
    sdk.getCustomer()?.setName(newUserName);
  }, []);

  const handleSendMessage = useCallback(
    (messageText: string) => {
      thread.sendTextMessage(messageText);
    },
    [thread],
  );

  const handleFileUpload = useCallback(
    (fileList: FileList) => {
      thread.sendAttachments(fileList);
    },
    [thread],
  );

  const handleMessageKeyUp = useCallback(() => {
    thread.keystroke();
  }, [thread]);

  const handleLoadMoreMessages = useCallback(async () => {
    const loadMoreMessageResponse = await thread.loadMoreMessages();

    if (loadMoreMessageResponse === null) {
      return;
    }

    const loadedMessages =
      loadMoreMessageResponse.data.messages.reverse() || [];

    setMessages((messages) => mergeMessages(messages, loadedMessages));
  }, [thread]);

  return (
    <>
      <User name={userName} onChange={handleInputUserNameChanged} />
      <MessagesBoard
        messages={messages}
        loadMoreMessages={handleLoadMoreMessages}
      />
      {agentName === null ? null : (
        <Typography variant="subtitle2" gutterBottom>
          You are talking with {agentName}
        </Typography>
      )}
      <SendMessageForm
        onSubmit={handleSendMessage}
        onFileUpload={handleFileUpload}
        onKeyUp={handleMessageKeyUp}
        disabled={false}
      />
    </>
  );
};
