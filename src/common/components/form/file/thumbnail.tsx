import _ from 'lodash';
import axios from 'axios';
import React from 'react';
import { useAsyncResource } from 'sugax';
import { FiLoader } from 'react-icons/fi';
import { blobToDataUrl } from '~/common/utils';
import { fileTypeIcon } from './icons';

type ThumbnailProps = {
  blob: Blob;
  url?: string;
};

export const Thumbnail: React.FC<ThumbnailProps> = ({
  blob,
  url,
}) => {

  const [dataUrl, setDataUrl] = React.useState<string>();

  React.useEffect(() => {
    if (url) return;
    (async () => setDataUrl(await blobToDataUrl(blob)))();
  }, [url, blob]);

  if (_.startsWith(blob.type, 'image/')) {
    return (
      <div className='w-100 h-100' style={{
        backgroundImage: `url("${url ?? dataUrl ?? ''}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }} />
    );
  }

  const Icon = fileTypeIcon(blob.type);

  return (
    <div className='d-flex flex-column justify-content-center align-items-center'>
      <Icon style={{ fontSize: 96 }} />
    </div>
  );
}

type FileThumbnailProps = {
  file: Parse.Object;
};

export const FileThumbnail: React.FC<FileThumbnailProps> = ({
  file,
}) => {

  const { resource } = useAsyncResource(() => axios.get(file.get('file').url(), { responseType: 'blob' }), [file]) as any;
  const blob = resource?.data as Blob;

  if (!blob) {
    return (
      <div className='d-flex flex-column justify-content-center align-items-center'>
        <FiLoader style={{ fontSize: 96 }} />
      </div>
    );
  }

  return (
    <Thumbnail blob={blob} url={file.get('file').url()} />
  );
};
