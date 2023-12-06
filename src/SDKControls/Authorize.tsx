import {
  ChatSdk,
  CustomerIdentityIdOnExternalPlatform,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { useCallback, useState } from 'react';
import { STORAGE_CHAT_AUTHORIZATION_CODE } from '../constants';

interface AuthorizeProps {
  sdk: ChatSdk;
}

export const Authorize = ({ sdk }: AuthorizeProps): JSX.Element => {
  const [authorized, setAuthorized] = useState(false);
  const [
    customerIdentityOnExternalPlatform,
    setCustomerIdentityOnExternalPlatform,
  ] = useState<CustomerIdentityIdOnExternalPlatform | null>(null);

  const onAuthorizeClick = useCallback(async () => {
    try {
      const authorizationCode =
        localStorage.getItem(STORAGE_CHAT_AUTHORIZATION_CODE) ?? undefined;

      await sdk.authorize(authorizationCode);

      const customerId = sdk.getCustomer()?.getId();
      if (customerId) {
        setCustomerIdentityOnExternalPlatform(customerId);
      }

      setAuthorized(true);
    } catch (error) {
      setAuthorized(false);
      localStorage.removeItem(STORAGE_CHAT_AUTHORIZATION_CODE);
      console.error(error);
      alert('Authorization failed. Please refresh.');
    }
  }, [sdk]);

  return (
    <div>
      <h2>{'Authorization'}</h2>
      <button onClick={onAuthorizeClick}>{'Authorize'}</button>
      {' - '}
      {authorized ? 'Authorized' : 'Not Authorized'}
      <div>CustomerIdentity: {customerIdentityOnExternalPlatform}</div>
    </div>
  );
};
