import _ from 'lodash';
import axios from 'axios';
import { GOOGLE_RECAPTCHA_SECRET_KEY } from '~/server/env';

const API_URL = 'https://www.google.com/recaptcha/api/siteverify';

export const verifyRecaptcha = async (token?: string) => {
  if (!_.isString(token) || _.isEmpty(token)) return false;
  const { data: { success } } = await axios.post(
    `${API_URL}?secret=${GOOGLE_RECAPTCHA_SECRET_KEY}&response=${token}`,
  );
  return !!success;
};