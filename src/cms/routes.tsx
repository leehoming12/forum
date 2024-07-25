import _ from 'lodash';
import React from 'react';
import { FaHome } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa6';
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage';
import UserPage from './pages/UserPage';

export type SideMenuRoute = {
  name: string;
  path?: string;
  icon?: React.JSX.Element;
  component?: React.JSX.Element;
  children?: SideMenuRoute[];
  roles?: string[];
};

export const sideMenu: SideMenuRoute[] = [
  {
    name: 'home',
    path: '/cms',
    icon: <FaHome className='me-2' />,
    component: <HomePage />,
  },
  {
    name: 'admins',
    path: '/cms/admins',
    icon: <FaUser className='me-2' />,
    component: <UsersPage title='admins' roles='admin' />,
    roles: ['admin'],
  },
  {
    name: 'users',
    path: '/cms/users',
    icon: <FaUser className='me-2' />,
    component: <UsersPage title='users' />,
  },
];

type Route = {
  name: string;
  path: string;
  component: React.JSX.Element;
  roles?: string[];
};

export const routes: Route[] = [
  {
    name: 'admins',
    path: '/cms/admins/:id',
    component: <UserPage title='admins' roles='admin' />,
    roles: ['admin'],
  },
  {
    name: 'users',
    path: '/cms/users/:id',
    component: <UserPage title='users' />,
  },
];
