import _ from 'lodash';
import React from 'react';
import { useAsyncResource } from 'sugax';
import { ListContext } from './utils/context';
import { ListOptions } from './utils/types';
import { ListTable, ListTableProps } from './table';
import { useAlert } from '../../hooks/alert';
import { ListPageLimit } from './controls/limit';
import { ListPagination } from './controls/skip';
import { ListSearch } from './controls/search';
import { ListSelect } from './controls/select';
import { ListDate } from './controls/date';
import { useSearchParams } from '../../hooks/searchParams';
import * as yup from 'yup';

export { useList } from './utils/context';
export { ListOptions };

type ListProps<Item, Query = any> = {
  alertTimeout?: number;
  history?: boolean;
  baseQuery?: (options: ListOptions) => Query | Promise<Query>;
  totalCount?: (options: ListOptions, query?: Query) => number | Promise<number>;
  resources: (options: ListOptions, query?: Query) => Item[] | Promise<Item[]>;
  debounce?: _.DebounceSettings & { wait?: number; };
  children: React.ReactNode | ((state: React.ContextType<typeof ListContext>) => React.ReactNode);
};

const useListOptions = (history: boolean) => {
  const state = React.useState<ListOptions>({});
  const param = useSearchParams<ListOptions>(yup.object({
    search: yup.string(),
    searchBy: yup.string(),
    skip: yup.number(),
    limit: yup.number(),
    sort: yup.object().transform(s => _.mapValues(s, v => parseInt(v, 10))),
    filter: yup.object(),
  }));
  return history ? param : state;
}

export const List = _.assign(<Item extends any, Query = any>({
  alertTimeout = 5000,
  history = true,
  baseQuery,
  totalCount,
  resources,
  debounce = { wait: 100 },
  children,
}: ListProps<Item, Query>) => {

  const [options, setOptions] = useListOptions(history);

  const { resource, error, refresh, count: refreshCount } = useAsyncResource({
    fetch: async () => {
      if (!options.limit) return;
      const query = await baseQuery?.(options);
      const copy = query instanceof Parse.Query ? Parse.Query.fromJSON(query.className, query.toJSON()) as Query : query;
      return {
        count: await totalCount?.(options, query),
        list: await resources(options, copy),
      };
    },
    debounce,
  }, [options]);

  const v = React.useMemo(() => ({
    options,
    setOptions,
    refresh,
    totalCount: resource?.count ?? 0,
    list: resource?.list ?? [],
    refreshCount,
  }), [options, resource]);

  const showAlert = useAlert();

  React.useEffect(() => {
    if (error) {
      showAlert('danger', error, alertTimeout);
      console.error(error);
    }
  }, [error]);

  return (
    <ListContext.Provider value={v}>
      {_.isFunction(children) ? children(v) : children}
    </ListContext.Provider>
  )
}, {
  Pagination: ListPagination,
  PageLimit: ListPageLimit,
  Search: ListSearch,
  Select: ListSelect,
  Date: ListDate,
  Table: <Item extends any>(props: Omit<ListTableProps<Item>, 'list'>) => (
    <ListTable list={React.useContext(ListContext).list} {...props} />
  ),
});
