import {
  ChatSdk,
  CustomerIdentityIdOnExternalPlatform,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { useCallback, useState } from 'react';

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
      await sdk.authorize();

      const customerId = sdk.getCustomer()?.getId();
      if (customerId) {
        setCustomerIdentityOnExternalPlatform(customerId);
      }

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
      <div>CustomerIdentity: {customerIdentityOnExternalPlatform}</div>
    </div>
  );
};
