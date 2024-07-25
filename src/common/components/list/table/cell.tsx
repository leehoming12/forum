import _ from 'lodash';
import React from 'react';
import { ListColumnInfo } from '../utils/types';

import formats from '../utils/formats';
import { FaCheck, FaTimes } from 'react-icons/fa';

type ListTableCellProps<Item> = {
  item: Item;
  list: Item[];
  idx: number;
  column: ListColumnInfo<Item>;
};

const fetchKey = (item: any, key: string) => {
  if (item instanceof Parse.Object) {
    switch (key) {
      case 'id': return item.id;
      case 'createdAt': return item.createdAt;
      case 'updatedAt': return item.updatedAt;
      default: return item.get(key);
    }
  }
  return _.get(item, key);
}

const convertStr = (v: any) => {
  if (_.isDate(v)) return v.toISOString();
  return v;
}

export const ListTableCell = <Item extends any>({
  item,
  list,
  idx,
  column,
}: ListTableCellProps<Item>) => {

  const { key, getter, format } = column;

  const value = fetchKey(item, key);
  const content = _.isFunction(getter) ? getter(value, item, idx, list) : value;

  if (_.isBoolean(content) || format === 'bool') {
    return content ? <FaCheck /> : <FaTimes />;
  }

  return (
    <>{format ? formats[format](convertStr(content)) : convertStr(content)}</>
  );
};
