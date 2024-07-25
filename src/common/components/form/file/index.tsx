import _ from 'lodash';
import React from 'react';
import { Upload, UploadInput } from './input';
import { FileBlock } from './block';

type FileUploaderProps = React.PropsWithChildren<{
  className?: string;
  id?: string;
  name?: string;
  value?: Parse.Object[];
  onChange?: (value: Parse.Object[]) => void;
  sortable?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  accept: string[];
  maxSize?: number;
}>;

export const FileUploader: React.FC<FileUploaderProps> = ({
  className,
  id,
  name,
  value,
  onChange,
  sortable = true,
  multiple = false,
  disabled = false,
  accept,
  maxSize,
  children,
}) => {

  const [uploads, setUploads] = React.useState<(Parse.Object | Upload)[]>(_.filter(value, x => x instanceof Parse.Object));
  React.useEffect(() => {
    if (onChange) onChange(_.filter(uploads, x => x instanceof Parse.Object) as Parse.Object[]);
  }, [uploads, onChange]);

  if (!multiple) {
    return (
      <UploadInput
        className={className}
        id={id}
        name={name}
        disabled={disabled}
        multiple={false}
        accept={accept}
        maxSize={maxSize}
        marginTop={_.isEmpty(children) && !_.isEmpty(uploads) ? 32 : 0}
        onFile={(files) => {
          const file = files[0];
          setUploads([new Upload(file, (file, upload) => {
            setUploads(v => {
              const [x] = v;
              return x === upload ? [file] : [x];
            });
          })]);
        }}
      >
        {children}
        {_.isEmpty(children) && !_.isEmpty(uploads) && (
          <FileBlock
            className='ratio ratio-1x1'
            sortable={false}
            upload={uploads[0]}
            onDelete={() => setUploads([])}
          />
        )}
      </UploadInput>
    );
  }

  return (
    <div className={`row ${!_.isEmpty(uploads) ? 'row-cols-2 row-cols-md-4' : ''} ${className ?? ''}`}>
      {_.map(uploads, (x, i) => (
        <div className='col p-1' key={i}>
          <FileBlock
            className='ratio ratio-1x1'
            sortable={sortable}
            isFirst={i === 0}
            isLast={i + 1 === uploads.length}
            upload={x}
            onDelete={() => setUploads(v => _.filter(v, k => k !== x))}
            onOrderPrev={() => setUploads(v => {
              const arr = [...v];
              [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
              return arr;
            })}
            onOrderNext={() => setUploads(v => {
              const arr = [...v];
              [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]];
              return arr;
            })}
          />
        </div>
      ))}
      <div className='col p-1'>
        <UploadInput
          className={!_.isEmpty(uploads) ? 'ratio ratio-1x1' : ''}
          id={id}
          name={name}
          disabled={disabled}
          multiple={true}
          accept={accept}
          maxSize={maxSize}
          style={_.isEmpty(uploads) ? { height: 200 } : {}}
          onFile={(files) => {
            const uploads = _.map(files, x => new Upload(x, (file, upload) => {
              setUploads(v => {
                const x = [...v];
                for (const [i, k] of x.entries()) {
                  if (k === upload) x[i] = file;
                }
                return x;
              });
            }));
            setUploads(v => [...v, ...uploads]);
          }}
        />
      </div>
    </div>
  );
}
