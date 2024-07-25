import { DateTime as dt } from 'luxon';
import truncate from 'lodash/truncate';

export default {
  datetime: (v: any) => (
    v ? dt.fromISO(v).toLocaleString(dt.DATETIME_MED) : ''
  ),
  date: (v: any) => (
    v ? dt.fromISO(v).toLocaleString(dt.DATE_MED) : ''
  ),
  time: (v: any) => (
    v ? dt.fromISO(v).toLocaleString(dt.TIME_SIMPLE) : ''
  ),
  fromNow: (v: any) => (
    v ? dt.fromISO(v).toRelative() : ''
  ),
  truncate: (v: any) => (v ? truncate(v, { length: 25 }) : ''),
};
