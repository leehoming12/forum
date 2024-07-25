import _ from 'lodash';
import React from 'react';

import formats from './formats';

export type ListOptions = {
  search?: string;
  searchBy?: string;
  skip?: number;
  limit?: number;
  sort?: Record<string, -1 | 1>;
  filter?: Record<string, any>;
};

export type ListColumnInfo<Item> = {
  name: string;
  key: string;
  label?: string;
  format?: keyof typeof formats | 'bool';
  getter?: (val: any, item: Item, idx: number, list: Item[]) => React.ReactNode;
  sortable?: boolean;
};
