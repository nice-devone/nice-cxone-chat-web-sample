import { DragEvent, ChangeEvent } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import './FileUpload.css';

interface FileUploadProps {
  onFileUpload: (files: FileList) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps): JSX.Element => {
  const dragEvents = {
    onDrop: (event: DragEvent<HTMLElement>) => {
      event.stopPropagation();
      event.preventDefault();

      if (event.dataTransfer.files.length > 0) {
        onFileUpload(event.dataTransfer.files);
      }
    },
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null && event.target.files.length > 0) {
      onFileUpload(event.target.files);
    }
  };

  return (
    <>
      <input
        onChange={handleInputChange}
        className="inputHidden"
        id="file-upload"
        type="file"
      />
      <label {...dragEvents} htmlFor="file-upload" className="fileUploadLabel">
        <CloudUploadIcon fontSize="large" />
      </label>
    </>
  );
};
