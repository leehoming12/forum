import path from 'path';
import parseRouter from './plugins/parse';
import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import * as schema from './schema';
import react_route from './react';

import {
  PORT,
} from './env';

const app = express();

app.use(logger('dev', {
  stream: {
    write: (str) => console.info(`\x1b[35m[${(new Date()).toISOString()}]\x1b[0m ${str.trim()}`),
  },
}));
app.use(cookieParser());

await parseRouter(app, {
  cloud: () => import('./cloud/main'),
  schema: {
    definitions: _.values(schema),
    recreateModifiedFields: true,
    deleteExtraFields: true,
  },
  serverStartComplete: () => import('./scripts'),
});

app.use(express.static(path.resolve(__dirname, './public'), { cacheControl: true }));

app.use(react_route);

const httpServer = require('http').createServer(app);
httpServer.listen(parseInt(PORT, 10), () => console.info(`listening on port ${PORT}`));
