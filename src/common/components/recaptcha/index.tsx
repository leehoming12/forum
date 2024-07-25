import _ from 'lodash';
import React from 'react';
import { GoogleReCaptchaProvider as Provider } from 'react-google-recaptcha-v3';

import { env } from '../../run/env';
const { GOOGLE_RECAPTCHA_CLIENT_KEY } = env;

export const GoogleReCaptchaProvider: React.FC<React.PropsWithChildren<{}>> = ({children}) => {
  if (_.isEmpty(GOOGLE_RECAPTCHA_CLIENT_KEY)) {
    return (
      <>{children}</>
    );
  }
  return (
    <Provider reCaptchaKey={GOOGLE_RECAPTCHA_CLIENT_KEY}>{children}</Provider>
  );
};
