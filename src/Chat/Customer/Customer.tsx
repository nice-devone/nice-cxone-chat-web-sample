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
import { useCallback, useRef, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';

interface CustomerProps {
  onChange: (name: string) => void;
  name?: string;
}

export const Customer = ({ name, onChange }: CustomerProps) => {
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const handleDialogOpenClick = useCallback(() => {
    setDialogOpen(true);
  }, []);

  const handleSubmit = useCallback(() => {
    const newName = nameInputRef.current?.value;
    onChange(newName ?? '');
    handleOnClose();
  }, []);

  const handleOnClose = useCallback(() => setDialogOpen(false), []);

  return (
    <>
      <Dialog open={dialogOpen} onClose={handleOnClose}>
        <DialogTitle>Set your name</DialogTitle>
        <DialogContent>
          <InputLabel htmlFor="input-with-icon-adornment">Your name</InputLabel>
          <TextField
            inputRef={nameInputRef}
            defaultValue={name}
            autoFocus
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              ),
            }}
          />
          <IconButton onClick={handleSubmit}>
            <SendIcon color="primary" />
          </IconButton>
        </DialogContent>
      </Dialog>
      <IconButton onClick={handleDialogOpenClick}>
        <AccountCircleIcon />
        <Typography padding={1} fontSize={14}>
          {name}
        </Typography>
      </IconButton>
    </>
  );
};
