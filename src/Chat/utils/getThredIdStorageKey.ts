import { STORAGE_CHAT_THREAD_ID } from '../../constants';

export function getThreadIdStorageKey(channelId: string) {
  if (channelId === undefined) {
    throw new Error('ChannelId must be provided');
  }

  return `${STORAGE_CHAT_THREAD_ID}_${channelId}`;
}
