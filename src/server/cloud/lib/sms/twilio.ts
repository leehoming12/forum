import twilio from 'twilio';

import {
  SMS_SERVICE_PROVIDER,
  SMS_AUTH_ACC,
  SMS_AUTH_TOKEN,
  SMS_FROM_NO,
} from '../../../env';
import { SMSOptions } from './types';

let client: twilio.Twilio;

if (SMS_SERVICE_PROVIDER === 'twilio' && SMS_AUTH_ACC && SMS_AUTH_TOKEN) {
  client = twilio(SMS_AUTH_ACC, SMS_AUTH_TOKEN);
}

console.log({ SMS_SERVICE_PROVIDER,
  SMS_AUTH_ACC,
  SMS_AUTH_TOKEN,
  SMS_FROM_NO,})

export default async({
  to,
  body,
}: SMSOptions) => {

  console.info('SMS message: ', body);

  if (!client) throw Error('SMS client does not initialize.');
  if (to[0] === '1') throw Error('Invalid phone number');

  const res = await client.messages.create({
    body,
    from: SMS_FROM_NO,
    to: to[0] === '+' ? to : `+852${to}`,
  });
  console.log('res', res)
  return res
};
