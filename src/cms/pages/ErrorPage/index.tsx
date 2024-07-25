import React from 'react';
import { useTranslation } from 'react-i18next';

export const ErrorPage: React.FC<{}> = ({ }) => {

  const { t } = useTranslation();

  return (
    <div className='w-100 flex-fill d-flex flex-column align-items-center justify-content-center'>
      <div className='fs-3 fw-bold'>{t('pages.errorPage')}</div>
    </div>
  );
};

export default ErrorPage;
