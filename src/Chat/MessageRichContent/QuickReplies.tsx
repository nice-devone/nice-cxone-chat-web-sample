import { CSSProperties, FC, useMemo } from 'react';
import { AdaptiveCard } from 'adaptivecards-react';
import { SubmitAction } from 'adaptivecards';
import { Postback } from './MessageRichContent.tsx';

interface QuickRepliesProps {
  payload: {
    text: { content: string };
    actions: { type: string; text: string; postback: string }[];
  };
  onAction: (postback: Postback) => void;
  hostConfig?: object;
  style?: CSSProperties;
}

interface SubmitActionWithPostback extends SubmitAction {
  data: Postback;
}

export const QuickReplies: FC<QuickRepliesProps> = ({
  payload,
  onAction,
  hostConfig,
  style,
}) => {
  const adaptiveCardPayload = useMemo(() => {
    return {
      type: 'AdaptiveCard',
      version: '1.3',
      body: [
        {
          type: 'TextBlock',
          text: payload.text.content,
        },
        {
          type: 'ActionSet',
          actions: payload.actions.map((action) => ({
            type: 'Action.Submit',
            data: { postback: action.postback, text: action.text },
            title: action.text,
          })),
        },
      ],
    };
  }, [payload]);

  return (
    <AdaptiveCard
      payload={adaptiveCardPayload}
      hostConfig={hostConfig}
      onActionSubmit={(action: SubmitActionWithPostback) =>
        onAction(action.data)
      }
      style={style}
    />
  );
};
