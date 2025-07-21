import {
  ChatSdk,
  ChatEvent,
  isSetPositionInQueueEvent,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { useState, useEffect } from 'react';

interface QueueCountingProps {
  sdk: ChatSdk;
}

export function QueueCounting({ sdk }: QueueCountingProps): JSX.Element | null {
  const [queuePosition, setQueuePosition] = useState(0);

  useEffect(() => {
    const removeListenerCallback = sdk.onChatEvent(
      ChatEvent.SET_POSITION_IN_QUEUE,
      (event) => {
        if (isSetPositionInQueueEvent(event.detail)) {
          setQueuePosition(event.detail.data.positionInQueue);
        }
      },
    );

    return removeListenerCallback;
  }, [setQueuePosition]);

  if (queuePosition === 0) {
    return null;
  }

  if (sdk.isLivechat === false) {
    return null;
  }

  return (
    <div data-testid="queue-counting">
      {`All our agents dedicated to your queue are currently busy.
      There are ${queuePosition} people ahead of you in the queue.`}
    </div>
  );
}
