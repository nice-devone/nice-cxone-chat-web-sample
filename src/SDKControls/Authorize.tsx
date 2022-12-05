import {
  ChatSdk,
  CustomerIdentity,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { useCallback, useState } from 'react';

interface AuthorizeProps {
  sdk: ChatSdk;
}

export const Authorize = ({ sdk }: AuthorizeProps): JSX.Element => {
  const [authorized, setAuthorized] = useState(false);
  const [customerIdentity, setCustomerIdentity] =
    useState<CustomerIdentity | null>(null);

  const onAuthorizeClick = useCallback(async () => {
    try {
      const authResponse = await sdk.authorize();
      setCustomerIdentity(authResponse.consumerIdentity);
      setAuthorized(true);
    } catch (error) {
      setAuthorized(false);
      console.error(error);
    }
  }, [sdk]);

  return (
    <div>
      <h2>{'Authorization'}</h2>
      <button onClick={onAuthorizeClick}>{'Authorize'}</button>
      {' - '}
      {authorized ? 'Authorized' : 'Not Authorized'}
      <div>CustomerIdentity: {customerIdentity?.idOnExternalPlatform}</div>
    </div>
  );
};
