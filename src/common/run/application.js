import React from 'react';
import { AlertProvider } from '../components/alert';
import { ParseProvider } from '../components/parse';
import { IconContext } from 'react-icons';
import { GoogleReCaptchaProvider } from '../components/recaptcha';
import { AsyncResourceErrors } from 'sugax';

const ProviderChain = ({ providers = [], children }) => _.reduceRight(providers, (children, Provider) => <Provider>{children}</Provider>, children);
const appProviders = [
  AsyncResourceErrors,
  ({ children }) => (
    <IconContext.Provider value={{
      style: { verticalAlign: '-0.125em' }
    }}>
      {children}
    </IconContext.Provider>
  ),
  AlertProvider,
  ParseProvider,
  GoogleReCaptchaProvider,
]

export default (App) => () => <ProviderChain providers={appProviders}><App /></ProviderChain>;