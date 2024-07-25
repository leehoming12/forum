import _ from 'lodash';
import express from 'express';
import { ReactRoute } from './plugins/react';
import application from '~/common/run/application';
import { createI18nInstance } from '~/common/run/i18n';
import App from '../site/App';
import CmsApp from '../cms/App';

import { locales as cms_locales } from '../cms/bin/locales';
import { locales as site_locales } from '../site/bin/locales';

import {
  APP_ID,
  PARSE_SERVER_URL,
  JAVASCRIPT_KEY,
  GOOGLE_API_KEY,
  GOOGLE_RECAPTCHA_CLIENT_KEY,
} from './env';

const route = express.Router();

const react_env = {
  BOOTSTRAP_BASE_URL: '/css/bootstrap',
  PARSE_SERVER_URL: PARSE_SERVER_URL,
  PARSE_APP_ID: APP_ID,
  PARSE_JAVASCRIPT_KEY: JAVASCRIPT_KEY,
  GOOGLE_API_KEY: GOOGLE_API_KEY,
  GOOGLE_RECAPTCHA_CLIENT_KEY: GOOGLE_RECAPTCHA_CLIENT_KEY,
};

const paths = {
  '/cms': {
    name: 'cms',
    component: CmsApp,
    locales: cms_locales,
  },
  '/': {
    name: 'site',
    component: App,
    locales: site_locales,
    resource: async (req) => { },
  },
};

for (const [path, { name, component, locales, resource, ...opts }] of _.entries(paths)) {
  route.use(path, ReactRoute(
    application(component),
    createI18nInstance(locales),
    resource,
    {
      env: react_env,
      jsSrc: `/${name}_bundle.js`,
      cssSrc: `/css/${name}_bundle.css`,
      ...opts,
    }
  ));
}

export default route;
