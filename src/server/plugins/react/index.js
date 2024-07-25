
import express from 'express';
import cookieParser from 'cookie-parser';
import i18nMiddleware from 'i18next-http-middleware';

import { renderToHTML } from './render';

export const ReactRoute = (App, i18n, resource, {
  env = {},
  jsSrc = '/bundle.js',
  cssSrc = '/css/bundle.css',
}) => {

  const router = express.Router();
  router.use(cookieParser());
  router.use(i18nMiddleware.handle(i18n));

  router.get('*', async (req, res) => {
    await renderToHTML(App, resource ? await resource(req) : {}, {
      req,
      res,
      env,
      jsSrc,
      cssSrc,
    });
  });

  return router;
}