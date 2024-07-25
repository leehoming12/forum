import _ from 'lodash';
const SMSClient = require('@alicloud/pop-core');

import {
  SMS_SERVICE_PROVIDER,
  SMS_AUTH_ACC,
  SMS_AUTH_TOKEN,
  SMS_FROM_NO,
} from '../../../env';
import { SMSOptions } from './types';

let client: any;

if (SMS_SERVICE_PROVIDER === 'aliyun' && SMS_AUTH_ACC && SMS_AUTH_TOKEN) {
  client = new SMSClient({
    accessKeyId: SMS_AUTH_ACC,
    accessKeySecret: SMS_AUTH_TOKEN,
    endpoint: 'https://sms-intl.ap-southeast-1.aliyuncs.com',
    apiVersion: '2018-05-01',
  });
}

export default ({
  to,
  body,
}: SMSOptions) => {

  console.info('SMS message: ', body);

  if (!client) throw Error('SMS client does not initialize.');

  return client.request('SendMessageToGlobe', {
    'RegionId': 'ap-southeast-1',
    'To': _.startsWith(to, '+') ? to.slice(1) : to,
    'Message': body,
    'From': SMS_FROM_NO,
  }, { method: 'POST' });
};
