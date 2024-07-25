import React from 'react';
import { Upload } from './input';
import { FileThumbnail } from './thumbnail';
import { FileUploadBlock } from './upload';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdOutlineCloudDownload } from 'react-icons/md';
import { blobToDataUrl } from '~/common/utils';

type FileBlockProps = {
  className?: string;
  sortable?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  upload: Parse.Object | Upload;
  onDelete?: React.MouseEventHandler<HTMLButtonElement>;
  onOrderPrev?: React.MouseEventHandler<HTMLAnchorElement>;
  onOrderNext?: React.MouseEventHandler<HTMLAnchorElement>;
};

export const FileBlock: React.FC<FileBlockProps> = ({
  className,
  sortable,
  isFirst,
  isLast,
  upload,
  onDelete,
  onOrderPrev,
  onOrderNext,
}) => {
  return (
    <div className={`border border-1 ${className}`}>
      {upload instanceof Parse.Object && <FileThumbnail file={upload} />}
      {upload instanceof Upload && <FileUploadBlock upload={upload} />}
      <div
        className='position-absolute top-0 start-0 end-0 m-0 row align-items-center'
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.75)',
          height: 32,
        }}
      >
        {sortable && !isFirst && (
          <a
            className='col-auto fs-4 link-secondary'
            onClick={onOrderPrev}
          >
            <MdKeyboardArrowLeft />
          </a>
        )}
        {sortable && !isLast && (
          <a
            className='col-auto fs-4 link-secondary'
            onClick={onOrderNext}
          >
            <MdKeyboardArrowRight />
          </a>
        )}
        <a
          className='col-auto fs-4 link-secondary ms-auto'
          aria-label='Download'
          onClick={async () => { 
            if (upload instanceof Upload) {
              window.open(await blobToDataUrl(upload.file), '_blank');
            }
            if (upload instanceof Parse.Object) {
              window.open(upload.get('file').url(), '_blank');
            }
          }}
        >
          <MdOutlineCloudDownload />
        </a>
        <button
          className='col-auto btn-close'
          type='button'
          aria-label='Delete'
          onClick={onDelete}
        />
      </div>
    </div>
  );
};
