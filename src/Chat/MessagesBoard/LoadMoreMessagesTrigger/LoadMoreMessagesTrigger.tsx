import { Button } from '@mui/material';

interface LoadMoreMessagesTriggerProps {
  onTrigger: () => void;
}

export const LoadMoreMessagesTrigger = ({
  onTrigger,
}: LoadMoreMessagesTriggerProps): JSX.Element => {
  return (
    <Button variant="text" onClick={onTrigger}>
      Load older messages
    </Button>
  );
};
