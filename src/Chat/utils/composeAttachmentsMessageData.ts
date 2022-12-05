import {
  SendMessageEventData,
  ThreadIdOnExternalPlatform,
} from '@nice-devone/nice-cxone-chat-web-sdk';

export function composeAttachmentsMessageData(
  threadId: ThreadIdOnExternalPlatform
): Omit<SendMessageEventData, 'attachments' | 'messageContent'> {
  return {
    thread: {
      idOnExternalPlatform: threadId,
    },
    consumer: {
      customFields: []
    },
    consumerContact: {
      customFields: []
    },
    idOnExternalPlatform: `message:${Math.random()}`,
    browserFingerprint: {
      browser: null,
      browserVersion: null,
      country: null,
      ip: null,
      language: "",
      location: null,
      os: null,
      osVersion: null,
      deviceToken: undefined,
      deviceType: null,
      applicationType: null
    }
  }
}
