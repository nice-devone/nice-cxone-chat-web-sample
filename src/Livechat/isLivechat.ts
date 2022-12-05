import { LivechatThread } from '@nice-devone/nice-cxone-chat-web-sdk';

export function isLivechat(thread: unknown): thread is LivechatThread {
  return thread instanceof LivechatThread;
}
