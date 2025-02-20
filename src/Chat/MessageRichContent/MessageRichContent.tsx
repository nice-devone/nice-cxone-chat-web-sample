import { CSSProperties, FC } from 'react';
import { Message, MessageType } from '@nice-devone/nice-cxone-chat-web-sdk';
import { AdaptiveCard } from 'adaptivecards-react';
import { QuickReplies } from './QuickReplies.tsx';
import { ListPicker } from './ListPicker.tsx';
import { RichLink } from './RichLink.tsx';

const adaptiveCardsHostConfig = {};
const adaptiveCardsStyle: CSSProperties = {
  overflow: 'hidden',
  whiteSpace: 'normal',
};

export interface Postback {
  text: string;
  postback: string;
}

interface MessageRichContentProps {
  message: Message;
  onAction: (postback: Postback) => void;
}

export const MessageRichContent: FC<MessageRichContentProps> = ({
  message,
  onAction,
}) => {
  const { type, payload } = message.messageContent;

  switch (type) {
    // Native Adaptive Cards - https://adaptivecards.io
    case MessageType.ADAPTIVE_CARD:
      return (
        <AdaptiveCard
          payload={payload}
          hostConfig={adaptiveCardsHostConfig}
          style={adaptiveCardsStyle}
        />
      );
    // Rich messages
    case MessageType.QUICK_REPLIES:
      return (
        <QuickReplies
          payload={payload}
          onAction={onAction}
          hostConfig={adaptiveCardsHostConfig}
        />
      );
    case MessageType.RICH_LINK:
      return (
        <RichLink
          payload={payload}
          hostConfig={adaptiveCardsHostConfig}
          style={adaptiveCardsStyle}
        />
      );
    case MessageType.LIST_PICKER:
      return (
        <ListPicker
          payload={payload}
          onAction={onAction}
          hostConfig={adaptiveCardsHostConfig}
          style={adaptiveCardsStyle}
        />
      );
    case MessageType.PLUGIN:
      console.warn('Plugin message type is not supported', payload);
      break;
  }

  return null;
};
