import path from 'path';
import ParseServer, { ParseGraphQLServer } from 'parse-server';
import ParseDashboard from 'parse-dashboard';
import FSFilesAdapter from '@parse/fs-files-adapter';

import {
  APP_ID,
  APP_NAME,
  PARSE_SERVER_URL,
  DATABASE_URI,
  MASTER_KEY,
  CLIENT_KEY,
  REST_API_KEY,
  JAVASCRIPT_KEY,
  DASHBOARD_USER,
  DASHBOARD_PASS,
  GRAPHQL_ENDPOINT,
  FILE_STORAGE_UPLOADS,
  GRAPHQL_SERVER_URL,
} from '../../env';

const fsDir = path.resolve(__dirname, '../', FILE_STORAGE_UPLOADS);

const PORT = !_.isEmpty(process.env.PORT) ? parseInt(process.env.PORT, 10) : 3000;

export async function parseRouter(express, options) {

  const server = new ParseServer({
    cloud: options.cloud,
    schema: options.schema,
    databaseURI: DATABASE_URI,
    appId: APP_ID,
    masterKey: MASTER_KEY,
    masterKeyIps: ['0.0.0.0/0', '::'],
    serverURL: `http://localhost:${PORT}/parse`,
    publicServerURL: PARSE_SERVER_URL || `http://localhost:${PORT}/parse`,
    restAPIKey: REST_API_KEY,
    clientKey: CLIENT_KEY,
    javascriptKey: JAVASCRIPT_KEY,
    directAccess: true,
    filesAdapter: new FSFilesAdapter({
      filesSubDirectory: path.relative(__dirname, fsDir),
    }),
  });

  await server.start();

  express.use('/parse', server.app);

  if (_.isFunction(options.serverStartComplete)) {
    express.listen(() => { options.serverStartComplete(); });
  }

  if (!_.isEmpty(DASHBOARD_USER) && !_.isEmpty(DASHBOARD_PASS)) {

    const config = {
      serverURL: PARSE_SERVER_URL || `http://localhost:${PORT}/parse`,
      appId: APP_ID,
      appName: APP_NAME || APP_ID,
      masterKey: MASTER_KEY,
    };
    if (!_.isEmpty(GRAPHQL_SERVER_URL)) {
      config.graphQLServerURL = GRAPHQL_SERVER_URL;
    }

    const dashboard = new ParseDashboard({
      apps: [config],
      users: [
        {
          user: DASHBOARD_USER,
          pass: DASHBOARD_PASS
        }
      ],
    }, { allowInsecureHTTP: true });

    express.use('/dashboard', dashboard);
  }

  if (!_.isEmpty(GRAPHQL_ENDPOINT)) {
    const graphQLServer = new ParseGraphQLServer(server, { graphQLPath: GRAPHQL_ENDPOINT });
    graphQLServer.applyGraphQL(express);
  }
}

export default parseRouter;