import { ChatSdk } from '@nice-devone/nice-cxone-chat-web-sdk';
import { Button, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useState } from 'react';

interface EndLivechatButtonProps {
  sdk: ChatSdk;
  handleEndLivechat: () => Promise<void>;
}
export function EndLivechatButton({
  sdk,
  handleEndLivechat,
}: EndLivechatButtonProps): JSX.Element | null {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onButtonClick = useCallback(async () => {
    setIsLoading(true);
    await handleEndLivechat();
  }, [handleEndLivechat]);

  if (sdk.isLivechat === false) {
    return null;
  }

  const LoadingIcon = isLoading ? <CircularProgress color="inherit" /> : null;

  return (
    <div className="start-livechat">
      <Button
        variant="contained"
        size="medium"
        onClick={onButtonClick}
        startIcon={LoadingIcon}
        color="secondary"
      >
        <Typography padding={1} fontSize={14}>
          End Livechat
        </Typography>
      </Button>
    </div>
  );
}
