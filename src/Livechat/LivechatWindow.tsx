import React, { FC, useCallback, useEffect, useRef, useState } from 'react';

import {
  AssignedAgentChangedData,
  AssignedAgentChangedEvent,
  ChatEvent,
  ChatEventData,
  ChatSdk,
  ContactStatus,
  ContactToRoutingQueueAssignmentChangedChatEvent,
  isAgentTypingEndedEvent,
  isAgentTypingStartedEvent,
  isContactStatusChangedEvent,
  isMessageCreatedEvent,
  LivechatThread,
  Message as ContentMessage,
  Thread,
} from '@nice-devone/nice-cxone-chat-web-sdk';

import { MessagesBoard } from '../Chat/MessagesBoard/MessagesBoard';
import { SendMessageForm } from '../Chat/SendMessageForm/SendMessageForm';
import { Customer } from '../Chat/Customer/Customer';
import { useWindowFocus } from '../hooks/focus';
import { parseAgentName } from '../Chat/Agent/agentName';
import { Typography } from '@mui/material';
import { QueueCounting } from '../Chat/QueueCounting/QueueCounting';
import { isLivechat } from './isLivechat';
import { StartLivechatButton } from './StartLivechatButton';
import { EndLivechatButton } from './EndLivechatButton';
import { mergeMessages } from '../state/messages/mergeMessages';
import { STORAGE_CHAT_CUSTOMER_NAME } from '../constants';
import { AgentTyping } from '../Chat/Agent/AgentTyping';
import { SystemMessage } from '../Chat/SystemMessage/SystemMessage';
import { Postback } from '../Chat/MessageRichContent/MessageRichContent.tsx';

type Message = ContentMessage | SystemMessage;

interface LiveChatWindowProps {
  sdk: ChatSdk;
  thread: Thread | LivechatThread;
}

/* prettier-ignore */
enum LivechatStatus {
  NEW = 'new',
  OPEN = 'open',
  CLOSED = 'closed',
}

export const LivechatWindow: FC<LiveChatWindowProps> = ({ sdk, thread }) => {
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const [customerName, setCustomerName] = useState<string>(
    localStorage.getItem(STORAGE_CHAT_CUSTOMER_NAME) ?? '',
  );
  const [disabled, setDisabled] = useState<boolean>(true);
  const windowFocus = useWindowFocus();
  const [agentName, setAgentName] = useState<string | null>(null);
  const [agentTyping, setAgentTyping] = useState<boolean | null>(null);
  const [livechatStatus, setLivechatStatus] = useState<LivechatStatus | null>(
    null,
  );

  const handleRecoverThreadStatus = useCallback((status: string) => {
    if (status === ContactStatus.CLOSED) {
      setLivechatStatus(LivechatStatus.CLOSED);
      setDisabled(true);

      return;
    }

    setLivechatStatus(LivechatStatus.OPEN);
    setDisabled(false);
  }, []);

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
        const contact = recoverResponse.contact;
        if (!contact) {
          return;
        }

        handleRecoverThreadStatus(contact.status);
      } catch (error) {
        if (isLivechat(thread)) {
          // if thread does not exist in the system show Livechat button
          setLivechatStatus(LivechatStatus.NEW);
          setDisabled(true);

          return;
        }

        console.error(error);
      }
    };

    recover();
  }, [handleRecoverThreadStatus, sdk, thread]);

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

  const handleCloseLivechatThread = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (!isContactStatusChangedEvent(event.detail)) {
        return;
      }

      const status = event.detail.data.case.status;

      if (status === ContactStatus.CLOSED) {
        setLivechatStatus(LivechatStatus.CLOSED);
        setDisabled(true);
      }
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

  // Attach ChatEvent listeners
  useEffect(() => {
    const removeMessageCreatedEventListener = thread.onThreadEvent(
      ChatEvent.MESSAGE_CREATED,
      handleMessageAdded,
    );
    const removeContactStatusChangedListener = sdk.onChatEvent(
      ChatEvent.CONTACT_STATUS_CHANGED,
      handleCloseLivechatThread,
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
      removeContactStatusChangedListener();
      removeAssignedAgentChangedListener();
      removeRoutingQueueAssignmentChangedListener();
      removeAgentTypingStartedListener();
      removeAgentTypingEndedListener();
    };
  }, [
    handleAgentTypingEndedEvent,
    handleAgentTypingStartedEvent,
    handleAssignedAgentChangeEvent,
    handleCloseLivechatThread,
    handleMessageAdded,
    handleRoutingQueueAssignmentChangedEvent,
    sdk,
    thread,
  ]);

  const handleInputCustomerNameChanged = useCallback(
    (newCustomerName: string) => {
      localStorage.setItem(STORAGE_CHAT_CUSTOMER_NAME, newCustomerName);
      setCustomerName(newCustomerName);
      sdk.getCustomer()?.setName(newCustomerName);
    },
    [sdk],
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

  const messagePreviewTimeoutId = useRef<ReturnType<typeof setTimeout>>();

  const handleMessageKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      thread.keystroke();

      const inputFieldContent = event.currentTarget.value;
      // defer sending message preview to avoid sending too many requests
      if (messagePreviewTimeoutId.current) {
        clearTimeout(messagePreviewTimeoutId.current);
      }
      messagePreviewTimeoutId.current = setTimeout(() => {
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

  const handleStartLivechat = useCallback(async () => {
    if (isLivechat(thread)) {
      await thread.startChat();

      setLivechatStatus(LivechatStatus.OPEN);
      setDisabled(false);
    }
  }, [thread]);

  const handleEndLivechat = useCallback(async () => {
    if (isLivechat(thread)) {
      await thread.endChat();

      setLivechatStatus(LivechatStatus.CLOSED);
      setDisabled(true);
    }
  }, [thread]);

  const handlePostback = useCallback(
    async (postback: Postback) => {
      const { text, postback: postbackValue } = postback;
      await thread.sendPostbackMessage(postbackValue, text);
    },
    [thread],
  );

  return (
    <>
      <QueueCounting sdk={sdk} />
      <Customer name={customerName} onChange={handleInputCustomerNameChanged} />
      <MessagesBoard
        messages={messages}
        loadMoreMessages={handleLoadMoreMessages}
        onPostback={handlePostback}
      />
      {agentName === null ? null : (
        <Typography variant="subtitle2" gutterBottom>
          You are talking with {agentName}
        </Typography>
      )}
      {livechatStatus === LivechatStatus.NEW ? (
        <StartLivechatButton
          sdk={sdk}
          handleStartLivechat={handleStartLivechat}
        />
      ) : null}
      {livechatStatus === LivechatStatus.OPEN ? (
        <EndLivechatButton sdk={sdk} handleEndLivechat={handleEndLivechat} />
      ) : null}
      {livechatStatus === LivechatStatus.CLOSED ? (
        <Typography variant="subtitle2" gutterBottom>
          Your chat ended.
        </Typography>
      ) : null}
      {agentTyping ? <AgentTyping /> : null}
      <SendMessageForm
        onSubmit={handleSendMessage}
        onFileUpload={handleFileUpload}
        onKeyUp={handleMessageKeyUp}
        disabled={disabled}
      />
    </>
  );
};
