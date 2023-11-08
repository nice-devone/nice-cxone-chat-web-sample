import ChatSdk, { EnvironmentName } from '@nice-devone/nice-cxone-chat-web-sdk';
import { Livechat } from './Livechat/Livechat';
import { Messenger } from './Messenger/Messenger';
import { MultiThreadMessenger } from './MultiThreadMessenger/MultiThreadMessenger';
import { STORAGE_CHAT_CUSTOMER_ID } from './constants';

enum AppVariant {
  LIVECHAT = 'LIVECHAT',
  MESSENGER = 'MESSENGER',
  MULTITHREAD = 'MULTITHREAD',
}

// Initialize Chat SDK with required options
const sdk = new ChatSdk({
  brandId: Number(process.env.REACT_APP_BRAND_ID as string),
  channelId: process.env.REACT_APP_CHANNEL_ID as string,
  customerId: localStorage.getItem(STORAGE_CHAT_CUSTOMER_ID) || '',
  environment: EnvironmentName.custom,
  customEnvironment: {
    gateway: `wss://${process.env.REACT_APP_CHAT_HOST_GATEWAY}`,
    chat: `https://${process.env.REACT_APP_CHAT_HOST_INTEGRATION}`,
    name: `${process.env.REACT_APP_CHAT_HOST_NAME}`,
  },
});

export const Root = (): JSX.Element | null => {
  switch (process.env.REACT_APP_VARIANT) {
    case AppVariant.LIVECHAT:
      return <Livechat sdk={sdk} />;

    case AppVariant.MESSENGER:
      return <Messenger sdk={sdk} />;

    case AppVariant.MULTITHREAD:
      return <MultiThreadMessenger sdk={sdk} />;

    default:
      return <p>It looks like you need to set the REACT_APP_VARIANT</p>;
  }
};
