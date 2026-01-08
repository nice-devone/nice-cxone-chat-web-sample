import { Message, MessagePayload } from '@nice-devone/nice-cxone-chat-web-sdk';

export function resolveChatMessageText(message: Message): string {
  return (
    (message.messageContent.payload as MessagePayload)?.text ??
    message.messageContent.fallbackText ??
    'Message content not supported'
  );
}
