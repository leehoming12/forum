import _ from 'lodash';
import { FaFileAlt, FaFileArchive } from 'react-icons/fa';
import { FaCode, FaFile, FaFileCsv, FaFileExcel, FaFilePdf, FaFilePowerpoint, FaFileWord, FaVimeo, FaYoutube } from 'react-icons/fa6';

const list = [
  {
    icon: FaFileWord,
    mimes: [
      'application/msword',
      'application/vnd.ms-word',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.openxmlformats-officedocument.wordprocessingml',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
  {
    icon: FaFileExcel,
    mimes: [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml',
      'application/vnd.oasis.opendocument.spreadsheet',
    ],
  },
  {
    icon: FaFilePowerpoint,
    mimes: [
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml',
      'application/vnd.oasis.opendocument.presentation',
    ],
  },
  { icon: FaFilePdf, mimes: ['application/pdf'] },
  { icon: FaFileAlt, mimes: ['text/plain'] },
  { icon: FaFileCsv, mimes: ['text/csv'] },
  {
    icon: FaCode,
    mimes: [
      'text/html',
      'application/json',
    ],
  },
  {
    icon: FaFileArchive,
    mimes: [
      'application/zip',
      'application/gzip',
    ],
  },
  {
    icon: FaYoutube,
    mimes: ['cloud/youtube'],
  },
  {
    icon: FaVimeo,
    mimes: ['cloud/vimeo'],
  },
];

export const fileTypeIcon = (type: string) => { 
  for (const { icon, mimes } of list) {
    if (_.includes(mimes, type)) return icon;
  }
  return FaFile;
}
