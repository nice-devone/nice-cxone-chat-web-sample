import { ContactToRoutingQueueAssignmentChangedChatEvent } from '@nice-devone/nice-cxone-chat-web-sdk';

export function getRoutingQueueAssignmentChangedMessage(
  event: ContactToRoutingQueueAssignmentChangedChatEvent,
): string | null {
  if (Array.isArray(event.context) || !event.context?.initiator) {
    return null;
  }

  if (event.context?.initiator.type !== 'user') {
    return null;
  }

  return 'You are being transferred. Please stand by.';
}
