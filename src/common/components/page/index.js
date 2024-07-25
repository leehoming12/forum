import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePageSSR } from './ssr';

export const Page = ({ title, meta, component }) => {
  const { t } = useTranslation();
  usePageSSR(context => {
    context.title = t(title, _.startCase(title));
    if (!_.isEmpty(meta)) context.meta = meta;
  });
  if (typeof window !== 'undefined') {
    document.title = t(title, _.startCase(title));
  }
  return (
    <>
      {component}
    </>
  );
};
