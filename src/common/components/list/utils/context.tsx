import React from 'react';
import { ListOptions } from './types';

export const ListContext = React.createContext<{
  options: ListOptions;
  setOptions: React.Dispatch<React.SetStateAction<ListOptions>>;
  refresh: () => Promise<void>;
  totalCount: number;
  list: any[];
  refreshCount: number;
}>({
  options: {},
  setOptions: () => void 0,
  refresh: () => Promise.resolve(),
  totalCount: 0,
  list: [],
  refreshCount: 0,
});

export const useList = () => React.useContext(ListContext);
