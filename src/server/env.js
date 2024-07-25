import path from 'path';
import Dotenv from 'dotenv';

const { error } = Dotenv.config({
  path: path.resolve(__dirname, '../private', '.env'),
});

if (error) throw error;

export const APP_ID = process.env.APP_ID;
export const APP_NAME = process.env.APP_NAME;

export const PORT = process.env.PORT || '3000';
export const SERVER_PUBLIC_URL = process.env.SERVER_PUBLIC_URL || `http://localhost:${PORT}`;
export const PARSE_SERVER_ENDPOINT = process.env.PARSE_SERVER_ENDPOINT || '/parse';
export const PARSE_SERVER_URL = `${_.trimEnd(SERVER_PUBLIC_URL, '/')}/${_.trimStart(PARSE_SERVER_ENDPOINT, '/')}`;

export const DATABASE_URI = process.env.DATABASE_URI;

export const MASTER_KEY = process.env.MASTER_KEY;
export const CLIENT_KEY = process.env.CLIENT_KEY;
export const REST_API_KEY = process.env.REST_API_KEY;
export const JAVASCRIPT_KEY = process.env.JAVASCRIPT_KEY;

export const DASHBOARD_USER = process.env.DASHBOARD_USER;
export const DASHBOARD_PASS = process.env.DASHBOARD_PASS;

export const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
export const GRAPHQL_SERVER_URL = GRAPHQL_ENDPOINT && `${_.trimEnd(SERVER_PUBLIC_URL, '/')}/${_.trimStart(GRAPHQL_ENDPOINT, '/')}`;

export const SMS_SERVICE_PROVIDER = process.env.SMS_SERVICE_PROVIDER;
export const SMS_AUTH_ACC = process.env.SMS_AUTH_ACC;
export const SMS_AUTH_TOKEN = process.env.SMS_AUTH_TOKEN;
export const SMS_FROM_NO = process.env.SMS_FROM_NO;

export const FILE_STORAGE_UPLOADS = process.env.FILE_STORAGE_UPLOADS || 'public/uploads';

export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
export const GOOGLE_RECAPTCHA_CLIENT_KEY = process.env.GOOGLE_RECAPTCHA_CLIENT_KEY;
export const GOOGLE_RECAPTCHA_SECRET_KEY = process.env.GOOGLE_RECAPTCHA_SECRET_KEY;
