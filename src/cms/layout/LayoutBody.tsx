import _ from 'lodash';
import React from 'react';
import ErrorBoundary from '~/common/components/error';
import ErrorPage from '../pages/ErrorPage';

export const LayoutBody: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => (
  <ErrorBoundary
    fallback={<ErrorPage />}
    onError={async (error, info) => {

      const ReactErrorLog = Parse.Object.extend('ReactErrorLog');

      const log = new ReactErrorLog();
      log.set('createdAt', new Date);
      log.set('platform', { OS: 'web' });
      log.set('error', {
        ...error,
        ..._.fromPairs(_.map(Object.getOwnPropertyNames(error), k => [k, (error as any)[k]])),
      });
      log.set('platform', info);

      await log.save();
    }}
  >
    {children}
  </ErrorBoundary>
);