import { FC } from 'react';
import {
  AssignedAgentChangedEvent,
  ChatEvent,
  ContactToRoutingQueueAssignmentChangedChatEvent,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import './SystemMessage.css';
import { getAssignedAgentChangedMessage } from './getAssignedAgentChangedMessage';
import { getRoutingQueueAssignmentChangedMessage } from './getRoutingQueueAssignmentChangedMessage';

export type SystemMessage =
  | AssignedAgentChangedEvent
  | ContactToRoutingQueueAssignmentChangedChatEvent;

interface SystemMessageProps {
  message: SystemMessage;
}

export const SystemMessage: FC<SystemMessageProps> = ({ message }) => {
  let text: string | null = null;

  switch (message.type) {
    case ChatEvent.ASSIGNED_AGENT_CHANGED:
      text = getAssignedAgentChangedMessage(message);
      break;
    case ChatEvent.CONTACT_TO_ROUTING_QUEUE_ASSIGNMENT_CHANGED:
      text = getRoutingQueueAssignmentChangedMessage(message);
      break;
  }

  if (text === null) {
    return null;
  }

  return (
    <div className="system-message">
      <span className="system-message-content">{text}</span>
    </div>
  );
};
