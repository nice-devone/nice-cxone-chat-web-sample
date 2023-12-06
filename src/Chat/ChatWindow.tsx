import React, { FC, useCallback, useEffect, useState } from 'react';

import {
  AssignedAgentChangedData,
  AssignedAgentChangedEvent,
  ChatEvent,
  ChatEventData,
  ChatSdk,
  ContactToRoutingQueueAssignmentChangedChatEvent,
  isAgentTypingEndedEvent,
  isAgentTypingStartedEvent,
  isMessageCreatedEvent,
  LivechatThread,
  Message as ContentMessage,
  Thread,
} from '@nice-devone/nice-cxone-chat-web-sdk';

import { MessagesBoard } from './MessagesBoard/MessagesBoard';
import { SendMessageForm } from './SendMessageForm/SendMessageForm';
import { Customer } from './Customer/Customer';
import { useWindowFocus } from '../hooks/focus';
import { parseAgentName } from './Agent/agentName';
import { Typography } from '@mui/material';
import { mergeMessages } from '../state/messages/mergeMessages';
import { STORAGE_CHAT_CUSTOMER_NAME } from '../constants';
import { AgentTyping } from './Agent/AgentTyping';
import { SystemMessage } from './SystemMessage/SystemMessage';

type Message = ContentMessage | SystemMessage;

interface ChatWindowProps {
  sdk: ChatSdk;
  thread: Thread | LivechatThread;
}

export const ChatWindow: FC<ChatWindowProps> = ({ sdk, thread }) => {
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const [customerName, setCustomerName] = useState<string>(
    localStorage.getItem(STORAGE_CHAT_CUSTOMER_NAME) ?? '',
  );
  const windowFocus = useWindowFocus();
  const [agentName, setAgentName] = useState<string | null>(null);
  const [agentTyping, setAgentTyping] = useState<boolean | null>(null);

  // Recover thread
  useEffect(() => {
    sdk
      .getCustomer()
      ?.setName(localStorage.getItem(STORAGE_CHAT_CUSTOMER_NAME) ?? '');

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

    const removeRoutingQueueAssignmentChangedListener = sdk.onChatEvent(
      ChatEvent.CONTACT_TO_ROUTING_QUEUE_ASSIGNMENT_CHANGED,
      handleRoutingQueueAssignmentChangedEvent,
    );

    const removeAgentTypingStartedListener = sdk.onChatEvent(
      ChatEvent.AGENT_TYPING_STARTED,
      handleAgentTypingStartedEvent,
    );

    const removeAgentTypingEndedListener = sdk.onChatEvent(
      ChatEvent.AGENT_TYPING_ENDED,
      handleAgentTypingEndedEvent,
    );

    return () => {
      removeMessageCreatedEventListener();
      removeAssignedAgentChangedListener();
      removeRoutingQueueAssignmentChangedListener();
      removeAgentTypingStartedListener();
      removeAgentTypingEndedListener();
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
      const systemMessage = event.detail as AssignedAgentChangedEvent;
      setMessages(
        (messages) =>
          new Map<string, Message>(
            messages.set(systemMessage.id, systemMessage),
          ),
      );
    },
    [],
  );

  const handleRoutingQueueAssignmentChangedEvent = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      const systemMessage =
        event.detail as ContactToRoutingQueueAssignmentChangedChatEvent;
      setMessages(
        (messages) =>
          new Map<string, Message>(
            messages.set(systemMessage.id, systemMessage),
          ),
      );
    },
    [],
  );

  const handleAgentTypingStartedEvent = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (isAgentTypingStartedEvent(event.detail)) {
        setAgentTyping(true);
      }
    },
    [],
  );

  const handleAgentTypingEndedEvent = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (isAgentTypingEndedEvent(event.detail)) {
        setAgentTyping(false);
      }
    },
    [],
  );

  const handleInputCustomerNameChanged = useCallback(
    (newCustomerName: string) => {
      localStorage.setItem(STORAGE_CHAT_CUSTOMER_NAME, newCustomerName);
      setCustomerName(newCustomerName);
      sdk.getCustomer()?.setName(newCustomerName);
    },
    [],
  );

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

  let messagePreviewTimeoutId: ReturnType<typeof setTimeout> | undefined =
    undefined;

  const handleMessageKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      thread.keystroke();

      const inputFieldContent = event.currentTarget.value;
      // defer sending message preview to avoid sending too many requests
      messagePreviewTimeoutId && clearTimeout(messagePreviewTimeoutId);
      messagePreviewTimeoutId = setTimeout(() => {
        thread.sendMessagePreview(inputFieldContent);
      }, 300);
    },
    [thread],
  );

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
      <Customer name={customerName} onChange={handleInputCustomerNameChanged} />
      <MessagesBoard
        messages={messages}
        loadMoreMessages={handleLoadMoreMessages}
      />
      {agentName === null ? null : (
        <Typography variant="subtitle2" gutterBottom>
          You are talking with {agentName}
        </Typography>
      )}
      {agentTyping ? <AgentTyping /> : null}
      <SendMessageForm
        onSubmit={handleSendMessage}
        onFileUpload={handleFileUpload}
        onKeyUp={handleMessageKeyUp}
        disabled={false}
      />
    </>
  );
};
