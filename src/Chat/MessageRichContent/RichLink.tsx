import { CSSProperties, FC, useMemo } from 'react';
import { AdaptiveCard } from 'adaptivecards-react';

interface RichLinkProps {
  payload: {
    media: {
      fileName: string;
      url: string;
      mimeType: string;
    };
    title: {
      content: string;
    };
    url: string;
  };
  hostConfig?: object;
  style?: CSSProperties;
}

export const RichLink: FC<RichLinkProps> = ({ payload, hostConfig, style }) => {
  const adaptiveCardPayload = useMemo(() => {
    return {
      type: 'AdaptiveCard',
      version: '1.5',
      body: [
        {
          type: 'Image',
          url: payload.media.url,
          spacing: 'none',
          size: 'stretch',
        },
      ],
      actions: [
        {
          type: 'Action.OpenUrl',
          title: payload.title.content,
          url: payload.url,
        },
      ],
    };
  }, [payload]);

  return (
    <AdaptiveCard
      payload={adaptiveCardPayload}
      hostConfig={hostConfig}
      style={style}
    />
  );
};
