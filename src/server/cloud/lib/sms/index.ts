
import {
  SMS_SERVICE_PROVIDER,
} from '../../../env';

import { SMSOptions } from './types';
import sendTwilio from './twilio';
import sendAliyun from './aliyun';

export const sendSMS = async (options: SMSOptions) => {
  try {
    switch (SMS_SERVICE_PROVIDER) {
      case 'twilio': return await sendTwilio(options);
      case 'aliyun': return await sendAliyun(options);
      default: {
        console.info('Invalid SMS_SERVICE_PROVIDER, please check the server\'s .env file');
        console.info('SMS options: ', options);
        break;
      }
    }
  } catch (e) {
    console.error('Send SMS Error:', e);
  }
};
