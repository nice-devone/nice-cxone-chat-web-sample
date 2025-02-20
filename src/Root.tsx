import { Livechat } from './Livechat/Livechat';
import { Messenger } from './Messenger/Messenger';
import { MultiThreadMessenger } from './MultiThreadMessenger/MultiThreadMessenger';
import { FC } from 'react';
import { ThirdPartyOauth } from './ThirdPartyOauth/ThirdPartyOauth';
import { SecuredSession } from './SecuredSession/SecuredSession';

enum AppVariant {
  LIVECHAT = 'LIVECHAT',
  MESSENGER = 'MESSENGER',
  MULTITHREAD = 'MULTITHREAD',
  THIRD_PARTY_OAUTH = 'THIRD_PARTY_OAUTH',
  SECURED_SESSION = 'SECURED_SESSION',
}

export const Root: FC = () => {
  switch (import.meta.env.REACT_APP_VARIANT) {
    case AppVariant.LIVECHAT:
      return <Livechat />;

    case AppVariant.MESSENGER:
      return <Messenger />;

    case AppVariant.MULTITHREAD:
      return <MultiThreadMessenger />;

    case AppVariant.SECURED_SESSION:
      return <SecuredSession />;

    case AppVariant.THIRD_PARTY_OAUTH:
      return <ThirdPartyOauth />;

    default:
      return <p>It looks like you need to set the REACT_APP_VARIANT</p>;
  }
};
