import {
  AssignedAgentChangedData,
  AssignedAgentChangedEvent,
} from '@nice-devone/nice-cxone-chat-web-sdk';

function getAgentName(
  assigneeData:
    | AssignedAgentChangedData['inboxAssignee']
    | AssignedAgentChangedData['previousInboxAssignee'],
): string {
  if (assigneeData === null) {
    return '';
  }

  const { nickname, firstName, surname } = assigneeData;

  if (nickname !== null && nickname !== '') {
    return nickname;
  }

  return `${firstName} ${surname}`;
}

export function getAssignedAgentChangedMessage(
  event: AssignedAgentChangedEvent,
): string | null {
  const {
    data: { inboxAssignee, previousInboxAssignee },
  } = event;

  const isAssigned = inboxAssignee !== null && previousInboxAssignee === null;
  const isReassigned = inboxAssignee !== null && previousInboxAssignee !== null;
  const isUnAssigned = inboxAssignee === null && previousInboxAssignee !== null;

  if (isAssigned) {
    return `${getAgentName(inboxAssignee)} has joined the chat`;
  }

  if (isReassigned) {
    return `Your case has been reassigned to ${getAgentName(inboxAssignee)}`;
  }

  if (isUnAssigned) {
    return `${getAgentName(previousInboxAssignee)} has left the chat`;
  }

  return null;
}
