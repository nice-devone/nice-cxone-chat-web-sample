import {
  Thread,
  SendMessageEventData,
  MessageType,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { useRef, useCallback } from 'react';

interface SendMessageProps {
  thread: Thread;
}

export const SendMessage = ({ thread }: SendMessageProps): JSX.Element => {
  const messageTextRef = useRef<HTMLTextAreaElement>(null);
  const onSendMessageClick = useCallback(async () => {
    const messageText = messageTextRef.current?.value;
    const messageId = 'message' + Math.random();

    const message: SendMessageEventData = {
      thread: {
        idOnExternalPlatform: thread.idOnExternalPlatform,
      },
      idOnExternalPlatform: messageId,
      messageContent: {
        type: MessageType.TEXT,
        payload: {
          text: messageText,
          postback: undefined,
          elements: undefined,
        },
      },
      attachments: [],
      browserFingerprint: {
        applicationType: null,
        ip: null,
        location: null,
        country: null,
        os: null,
        osVersion: null,
        deviceType: null,
        browser: null,
        browserVersion: null,
        language: '',
      },
      consumer: {
        customFields: [],
      },
      consumerContact: {
        customFields: [],
      },
    };

    try {
      await thread.sendMessage(message);
    } catch (error) {
      console.error(error);
    }
  }, [thread]);

  return (
    <div>
      <h2>{'Send messages'}</h2>
      <div>
        <textarea
          id="message"
          ref={messageTextRef}
          placeholder="Your message"
          cols={50}
          rows={3}
        />
      </div>
      <button onClick={onSendMessageClick}>{'Send message'}</button>
    </div>
  );
};
