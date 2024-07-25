import React from 'react';
import { useAsyncEffect, useAsyncResource } from 'sugax';

export const ParseContext = React.createContext<{
  currentUser?: Parse.User;
  userRoles?: Parse.Role<Parse.Attributes>[];
  config?: Parse.Config;
  ready: boolean;
  refresh: () => Promise<void>;
}>({
  ready: false,
  refresh: () => Promise.resolve(),
});

export const ParseProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children
}) => {
  const { resource, refresh, count, error } = useAsyncResource(async () => {
    const currentUser = await Parse.User.current()?.fetch();
    const userRoles = currentUser ? await Parse.Cloud.run('userRoles') : [];
    const config = await Parse.Config.get();
    return {
      currentUser,
      userRoles,
      config,
    };
  });
  useAsyncEffect(async () => {
    const _error = error as any;
    if (_error && _error.code === 209) {
      await Parse.User.logOut();
      refresh();
    }
  }, [error]);
  const value = React.useMemo(() => ({
    ...resource ?? {},
    ready: count !== 0,
    refresh,
  }), [resource, count]);
  return (
    <ParseContext.Provider value={value}>{children}</ParseContext.Provider>
  )
}
