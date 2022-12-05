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
  isContactStatusChangedEvent,
} from '@nice-devone/nice-cxone-chat-web-sdk';

import { MessagesBoard } from '../Chat/MessagesBoard/MessagesBoard';
import { SendMessageForm } from '../Chat/SendMessageForm/SendMessageForm';
import { User } from '../Chat/User/User';
import { useWindowFocus } from '../hooks/focus';
import { parseAgentName } from '../Chat/Agent/agentName';
import { Typography } from '@mui/material';
import { QueueCounting } from '../Chat/QueueCounting/QueueCounting';
import { isLivechat } from './isLivechat';
import { StartLivechatButton } from './StartLivechatButton';
import { EndLivechatButton } from './EndLivechatButton';
import { mergeMessages } from '../state/messages/mergeMessages';

interface LiveChatwindowProps {
  sdk: ChatSdk;
  thread: Thread | LivechatThread;
}

enum LivechatStatus {
  NEW = 'new',
  OPEN = 'open',
  CLOSED = 'closed',
}

export const LivechatWindow = ({
  sdk,
  thread,
}: LiveChatwindowProps): JSX.Element => {
  const [messages, setMessages] = useState<Map<string, Message>>(new Map());
  const [userName, setUserName] = useState<string>(
    localStorage.getItem('userName') ?? '',
  );
  const [disabled, setDisabled] = useState<boolean>(false);
  const windowFocus = useWindowFocus();
  const [agentName, setAgentName] = useState<string | null>(null);
  const [livechatStatus, setLivechatStatus] = useState<LivechatStatus | null>(
    null,
  );

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
        handleRecoverThreadStatus(recoverResponse.consumerContact.status);
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
  }, [thread]);

  // Attach ChatEvent listeners
  useEffect(() => {
    const removeMessageCreatedEventListener = thread.onThreadEvent(
      ChatEvent.MESSAGE_CREATED,
      handleMessageAdded,
    );
    const removeContactStatusChangedListener = sdk.onChatEvent(
      ChatEvent.CASE_STATUS_CHANGED,
      handleCloseLivechatThread,
    );
    const removeAssignedAgentChangedListener = sdk.onChatEvent(
      ChatEvent.ASSIGNED_AGENT_CHANGED,
      handleAssignedAgentChangeEvent,
    );

    return () => {
      removeMessageCreatedEventListener();
      removeContactStatusChangedListener();
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

  const handleCloseLivechatThread = useCallback(
    (event: CustomEvent<ChatEventData>) => {
      if (!isContactStatusChangedEvent(event.detail)) {
        return;
      }

      const status = event.detail.data.case.status;

      if (status === 'closed') {
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
    },
    [],
  );

  const handleInputUserNameChanged = useCallback((newUserName: string) => {
    localStorage.setItem('userName', newUserName);
    setUserName(newUserName);
    sdk.getCustomer()?.setName(newUserName);
  }, []);

  const handleRecoverThreadStatus = useCallback((status: string) => {
    if (status === 'closed') {
      setLivechatStatus(LivechatStatus.CLOSED);
      setDisabled(true);

      return;
    }

    setLivechatStatus(LivechatStatus.OPEN);
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

  return (
    <>
      <QueueCounting sdk={sdk} />
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
      <SendMessageForm
        onSubmit={handleSendMessage}
        onFileUpload={handleFileUpload}
        onKeyUp={handleMessageKeyUp}
        disabled={disabled}
      />
    </>
  );
};
