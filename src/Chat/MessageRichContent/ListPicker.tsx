import { CSSProperties, FC, useMemo } from 'react';
import { AdaptiveCard } from 'adaptivecards-react';
import { SubmitAction } from 'adaptivecards';
import { Postback } from './MessageRichContent.tsx';

interface ListPickerProps {
  payload: {
    title: { content: string };
    text: { content: string };
    actions: {
      type: string;
      icon?: {
        fileName: string;
        url: string;
        mimeType: string;
      };
      text: string;
      description?: string;
      postback?: string;
    }[];
  };
  onAction: (postback: Postback) => void;
  hostConfig?: object;
  style?: CSSProperties;
}

interface SubmitActionWithPostback extends SubmitAction {
  data: Postback;
}

export const ListPicker: FC<ListPickerProps> = ({
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
            tooltip: action.description,
            iconUrl: action.icon?.url,
          })),
        },
      ],
    };
  }, [payload]);

  return (
    <AdaptiveCard
      payload={adaptiveCardPayload}
      hostConfig={hostConfig}
      style={style}
      onActionSubmit={(action: SubmitActionWithPostback) =>
        onAction(action.data)
      }
    />
  );
};
