import _ from 'lodash';
import React from 'react';
import { useFormEventListener } from '../action';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useAsyncEffect, useStableCallback } from 'sugax/dist/index.web';
import { useField } from 'formik';

export const FormRecaptcha: React.FC<{
  name: string;
  action?: string;
}> = ({ name, action }) => {
  const [, , { setValue }] = useField(name);
  const {
    addEventListener, removeEventListener,
  } = useFormEventListener();

  const { executeRecaptcha } = useGoogleReCaptcha();
  const _executeRecaptcha = useStableCallback(executeRecaptcha ?? (() => undefined));

  useAsyncEffect(async () => {
    if (!executeRecaptcha) return;
    const token = await _executeRecaptcha(action);
    setValue(token);
  }, [!!executeRecaptcha]);

  React.useEffect(() => {
    const callback = async () => {
      const token = await _executeRecaptcha(action);
      setValue(token);
    };
    addEventListener('submit', callback);
    return () => removeEventListener('submit', callback);
  }, [action]);

  return <></>;
}