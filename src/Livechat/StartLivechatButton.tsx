import { ChatSdk } from '@nice-devone/nice-cxone-chat-web-sdk';
import { Button, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { useCallback, useState } from 'react';

interface StartLivechatButtonProps {
  sdk: ChatSdk;
  handleStartLivechat: () => Promise<void>;
}
export function StartLivechatButton({
  sdk,
  handleStartLivechat,
}: StartLivechatButtonProps): JSX.Element | null {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onButtonClick = useCallback(async () => {
    setIsLoading(true);
    await handleStartLivechat();
  }, [handleStartLivechat]);

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
      >
        <Typography padding={1} fontSize={14}>
          Start Livechat
        </Typography>
      </Button>
    </div>
  );
}
