import _ from 'lodash';
import common from '../i18n/common.json';
import glossary from '../i18n/glossary.json';

export const locales = { common, glossary };
export const lngs = _.uniq(_.flatMap(_.values(locales), x => _.keys(x)));