import React from 'react';
import { Upload } from './input';
import { Thumbnail } from './thumbnail';
import { useFormEventListener } from '../action';
import { Spinner } from 'react-bootstrap';
import { useAlert } from '~/common/hooks/alert';
import { BiError } from 'react-icons/bi';

type FileUploadBlockProps = {
  upload: Upload;
};

export const FileUploadBlock: React.FC<FileUploadBlockProps> = ({
  upload,
}) => {

  const progress = upload.useProgress();
  const status = upload.useStatus();

  const {
    addEventListener, removeEventListener,
  } = useFormEventListener();

  React.useEffect(() => {
    const callback = () => upload.startUpload();
    addEventListener('submit', callback);
    return () => removeEventListener('submit', callback);
  }, [status]);

  return (
    <div>
      <Thumbnail blob={upload.file} />
      <div
        className='position-absolute top-0 bottom-0 start-0 end-0'
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className='w-100 h-100 d-flex justify-content-center align-items-center'>
          {!status.error && <Spinner variant='light' />}
          {status.error && <BiError style={{ color: 'white', fontSize: 36 }} />}
        </div>
        <div
          className='bg-primary position-absolute bottom-0 start-0'
          style={{
            width: `${Math.round(progress.loaded / progress.total * 100)}%`,
            height: 4,
          }}
        />
      </div>
    </div>
  );
};
