// Import Chat SDK
import {
  ChatSdk,
  Thread,
  LivechatThread,
} from '@nice-devone/nice-cxone-chat-web-sdk';
import { Authorize } from './Authorize';
import { Messages } from './Messages';
import { SendMessage } from './SendMessage';

interface SDKControlProps {
  sdk: ChatSdk;
  thread: Thread | LivechatThread;
}

const SDKControl = ({ sdk, thread }: SDKControlProps): JSX.Element => {
  return (
    <>
      <h1>SDKControl</h1>
      <div>thread.idOnExternalPlatform: {thread.idOnExternalPlatform}</div>
      <Authorize sdk={sdk} />
      <hr />
      <SendMessage thread={thread} />
      <hr />
      <Messages sdk={sdk} threadId={thread.idOnExternalPlatform} />
    </>
  );
};

export default SDKControl;
