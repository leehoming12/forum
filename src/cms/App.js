import _ from 'lodash';
import React from 'react';
import Layout from './layout';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import { Route, Routes } from 'react-router-dom';
import { useParseDataReady, useParseUser, useParseUserRoles } from '~/common/hooks/parse';
import { allowedRoles } from './consts';
import { routes, sideMenu } from './routes';
import { roleCheck } from './layout/SideMenu';
import { Page } from '~/common/components/page';
import { useAsyncEffect } from 'sugax';

export const App = () => {

  const ready = useParseDataReady();
  const user = useParseUser();
  const userRoles = useParseUserRoles();

  useAsyncEffect(async () => {
    if (user && !user.get('active')) {
      await Parse.User.logOut();
      window.location.reload();
    }
  }, [user]);

  // show blank page to wait for data loading
  if (!ready) return <div />

  const flattern = (route) => [route, ..._.flatMap(roleCheck(route.children, userRoles), flattern)];
  const _sideMenu = _.flatMap(roleCheck(sideMenu, userRoles), flattern);
  const _routes = roleCheck(routes, userRoles);

  return user && !_.isEmpty(_.intersection(allowedRoles, userRoles)) ? (
    <Layout>
      <Routes>
        {_.map(_sideMenu, ({ name, path, component }) => (
          <Route key={path} path={path} element={<Page title={name} component={component} />} />
        ))}
        {_.map(_routes, ({ name, path, component }) => (
          <Route key={path} path={path} element={<Page title={name} component={component} />} />
        ))}
        <Route path='*' element={<Page title='pages.notFound' component={<NotFound />} />} />
      </Routes>
    </Layout>
  ) : (
    <LoginPage />
  );
};

export default App;
