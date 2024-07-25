import _ from 'lodash';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

const LanguageDetector = typeof window === 'undefined'
  ? require('i18next-http-middleware').LanguageDetector
  : require('i18next-browser-languagedetector').default

const languageDetector = new LanguageDetector();
const namespaces = ['common', 'glossary'] as const;

export type I18nResources = Record<(typeof namespaces)[number], Record<string, object>>;

export const createI18nInstance = (
  resources: I18nResources
) => {

  const lng = _.uniq(_.flatMap(_.values(resources), x => _.keys(x)));
  const _resources = _.fromPairs(_.map(lng, x => [x, _.mapValues(resources, r => r[x])]));

  const i18n = createInstance();

  const detection = typeof window === 'undefined' ? {} : {
    order: ['querystring', 'cookie', 'header'],
    caches: ['cookie'],
    cookieOptions: {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'strict',
      secure: window.location.protocol === 'https:',
    },
  };

  i18n
    .use(languageDetector)
    .use(initReactI18next)
    .init({
      lowerCaseLng: true,
      fallbackLng: _.includes(lng, 'en') ? 'en' : _.first(lng),
      resources: _resources,
      ns: namespaces,
      fallbackNS: ['glossary'],
      interpolation: {
        escapeValue: false
      },
      detection,
    } as any);

  return i18n;
};
