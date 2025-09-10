import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from '@mui/material';
import { FC, useCallback, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

interface CustomerProps {
  onChange: (name: string) => void;
  name?: string;
}

export const Customer: FC<CustomerProps> = ({ name, onChange }) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpenClick = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleOnClose = useCallback(() => setDialogOpen(false), []);
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const newName = nameInputRef.current?.value;
      onChange(newName ?? '');
      handleOnClose();
    },
    [handleOnClose, onChange],
  );

  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={handleOnClose}
        data-testid="customer-dialog"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Set your name</DialogTitle>
          <DialogContent>
            <InputLabel htmlFor="input-with-icon-adornment">
              Your name
            </InputLabel>
            <TextField
              inputRef={nameInputRef}
              defaultValue={name}
              data-testid="customer-name-input"
              autoFocus
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircleIcon />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton type="submit">
              <SendIcon color="primary" />
            </IconButton>
          </DialogContent>
        </form>
      </Dialog>
      <IconButton onClick={handleDialogOpenClick} data-testid="customer-button">
        <AccountCircleIcon />
        <Typography padding={1} fontSize={14} data-testid="customer-name">
          {name}
        </Typography>
      </IconButton>
    </>
  );
};
