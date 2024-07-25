import _ from 'lodash';

export const withSearchQuery = <T extends Parse.Object>(
  query: Parse.Query<T>,
  search: string | undefined,
  searchBy: string | undefined,
  searchKeys: string[],
) => {
  if (!search) return query;
  if (searchBy) return query.contains(searchBy, search);
  if (_.isEmpty(searchKeys)) return query;
  if (searchKeys.length === 1) return query.contains(searchKeys[0], search);
  return Parse.Query.and(query, Parse.Query.or(..._.map(searchKeys, k => {
    const q = new Parse.Query(query.className);
    return q.contains(k, search);
  })));
}
