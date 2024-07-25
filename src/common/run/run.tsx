import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { Settings as LuxonSetting } from 'luxon';
import { I18nextProvider } from 'react-i18next';
import { I18nResources, createI18nInstance } from './i18n';

export const runApplication = (
  App: React.FunctionComponent,
  resources: I18nResources,
) => {

  const i18n = createI18nInstance(resources);

  LuxonSetting.defaultLocale = i18n.language;

  i18n.on('languageChanged', (lng) => {
    LuxonSetting.defaultLocale = lng;
  });

  const Main = () => (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter><App /></BrowserRouter>
    </I18nextProvider>
  );

  const root = createRoot(document.getElementById('root')!);
  root.render(<Main />);
}
