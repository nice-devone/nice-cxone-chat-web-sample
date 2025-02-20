import { Typography } from '@mui/material';
import { FC } from 'react';

interface MessageTextProps {
  text: string;
}

export const MessageText: FC<MessageTextProps> = ({ text }) => {
  if (!text || !text.length) {
    return null;
  }

  return <Typography variant="body1">{text}</Typography>;
};
