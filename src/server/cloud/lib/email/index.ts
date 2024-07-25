import nodemailer from 'nodemailer';

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
  MAIL_DEFAULT_SENDER,
} = process.env;

export const Mail = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT || 587,
  secure: MAIL_PORT === '465', // Use `true` for port 465, `false` for all other ports
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD,
  },
});
