import { Message } from '@nice-devone/nice-cxone-chat-web-sdk';

export function mergeMessages(
  originalMessages: Map<string, Message>,
  newMessages: Array<Message>,
): Map<string, Message> {
  return [...newMessages, ...Array.from(originalMessages.values())].reduce(
    (acc, message) => {
      return acc.set(message.id, message);
    },
    new Map<string, Message>(),
  );
}
