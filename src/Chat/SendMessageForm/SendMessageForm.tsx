import { FC, KeyboardEventHandler } from 'react';
import { IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import { useCallback, useRef } from 'react';
import './SendMessageForm.css';
import { FileUpload } from '../FileUpload/FileUpload';

interface SendMessageFormProps {
  onFileUpload: (files: FileList) => void;
  onKeyUp: KeyboardEventHandler<HTMLInputElement>;
  onSubmit: (text: string) => void;
  disabled: boolean;
}

export const SendMessageForm: FC<SendMessageFormProps> = ({
  disabled,
  onFileUpload,
  onKeyUp,
  onSubmit,
}) => {
  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return;
    }

    const text = textFieldRef.current?.value;
    if (text) {
      onSubmit(text);
    }

    if (textFieldRef.current) {
      textFieldRef.current.value = '';
    }
  }, [disabled, onSubmit]);

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
      return onKeyUp(event);
    },
    [handleSubmit, onKeyUp],
  );

  return (
    <div className="send-message-form">
      <TextField
        data-testid="send-message-form-text-input"
        className="send-message-form-text-input"
        disabled={disabled}
        inputRef={textFieldRef}
        label="Message"
        variant="outlined"
        color="primary"
        fullWidth
        focused
        autoFocus
        InputProps={{
          endAdornment: (
            <FileUpload onFileUpload={onFileUpload} disabled={disabled} />
          ),
          onKeyUp: handleKeyUp,
        }}
      />
      <IconButton onClick={handleSubmit}>
        <SendIcon color="primary" />
      </IconButton>
    </div>
  );
};
