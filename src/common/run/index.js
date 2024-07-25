import 'jquery';
import 'bootstrap/dist/js/bootstrap.js';
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite';

import application from './application';
import { runApplication } from './run';
import { env } from './env';

Parse.initialize(env.PARSE_APP_ID, env.PARSE_JAVASCRIPT_KEY);

const server_url = new URL(env.PARSE_SERVER_URL);
if (
  server_url.hostname === 'localhost' &&
  window.location.hostname !== 'localhost'
) {
  server_url.hostname = window.location.hostname;
  Parse.serverURL = server_url.href;
} else {
  Parse.serverURL = env.PARSE_SERVER_URL;
}

export default (App, resources) => runApplication(application(App), resources);