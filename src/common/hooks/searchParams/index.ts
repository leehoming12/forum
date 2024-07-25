import _ from 'lodash';
import React from 'react';
import qs from 'qs';
import { AnyObject, Maybe, ObjectSchema } from 'yup';
import { useSearchParams as _useSearchParams } from 'react-router-dom';

const parse = (params: URLSearchParams) => qs.parse(params.toString());

export const useSearchParams = <T extends Maybe<AnyObject>>(schema: ObjectSchema<T>) => {
  const [params, setParams] = _useSearchParams();
  const typed = React.useMemo(() => schema.cast(parse(params)), [params]);
  return [typed, (value: React.SetStateAction<T>) => {
    if (_.isFunction(value)) {
      setParams(p => qs.stringify(value(schema.cast(parse(p)) as T)));
    } else {
      setParams(qs.stringify(value));
    }
  }] as const;
};
