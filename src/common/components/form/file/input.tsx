import _ from 'lodash';
import React from 'react';
import { createChannel, useChannel } from 'sugax';
import { MdOutlineCloudUpload } from 'react-icons/md';


const MediaFile = Parse.Object.extend("MediaFile")
export class Upload {

  file: File;
  uploaded?: Parse.Object;
  #promise?: Promise<void>;

  onCompleted: (file: Parse.Object, upload: Upload) => void;

  #status = createChannel<{ status: string; error?: any }>({ status: 'pending' });
  #progress = createChannel({ loaded: 0, total: 0 });

  constructor(file: File, onCompleted: (file: Parse.Object, upload: Upload) => void) {
    this.file = file;
    this.onCompleted = onCompleted;
    this.startUpload();
  }

  startUpload() {
    if (this.uploaded) return Promise.resolve(this.uploaded);
    this.#promise = this.#promise ?? (async () => {
      this.#status.setValue({ status: 'pending' });
      try {
        const obj = new Parse.File('file', this.file, this.file.type);
        await obj.save({
          progress: (
            progressValue: number,
            loaded: number,
            total: number,
            { type }: { type: string },
          ) => {
            if (type === 'upload' && progressValue !== null) {
              this.#progress.setValue({ loaded, total });
            }
          },
        });
        const mediaFile = new MediaFile
        mediaFile.set('file', obj)
        mediaFile.set('name',this.file.name)

        this.uploaded = await mediaFile.save();
        this.onCompleted(this.uploaded!, this);
        this.#status.setValue({ status: 'completed' });
      } catch (error) {
        this.#status.setValue({ status: 'error', error });
        throw error;
      } finally {
        this.#promise = undefined;
      }
    })();
    return this.#promise;
  }

  useStatus() {
    return useChannel(this.#status);
  }

  useProgress() {
    return useChannel(this.#progress);
  }
};

type UploadInputProps = React.PropsWithChildren<{
  className?: string;
  style?: React.CSSProperties;
  marginTop?: number;
  id?: string;
  name?: string;
  multiple?: boolean;
  disabled?: boolean;
  accept: string[];
  maxSize?: number;
  onFile: (files: FileList) => void;
}>;

export const UploadInput: React.FC<UploadInputProps> = ({
  className,
  style,
  marginTop,
  id,
  name,
  multiple = false,
  disabled = false,
  accept,
  maxSize,
  onFile,
  children,
}) => {
  return (
    <div
      className={`position-relative ${className ?? ''}`}
      style={style}
    >
      {_.isEmpty(_.compact(_.castArray(children))) ? (
        <div
          className='rounded d-flex flex-column justify-content-center align-items-center'
          style={{
            color: '#b5b8bb',
            border: 'dashed 6px #dee2e6',
            minWidth: '100%',
            minHeight: '100%',
          }}
        >
          <MdOutlineCloudUpload style={{ fontSize: 96 }} />
        </div>
      ) : children}
      <input
        className={`position-absolute ${marginTop ? '' : 'top-0'} bottom-0 start-0 end-0`}
        id={id}
        name={name}
        type='file'
        value={[]}
        accept={accept.join()}
        style={{
          opacity: 0,
          ...marginTop ? { top: marginTop } : {},
        }}
        disabled={disabled}
        multiple={multiple}
        onChange={(e) => {
          const { files } = e.target as any;
          onFile(files);
        }}
      />
    </div>
  );
};
