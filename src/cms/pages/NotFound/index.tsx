import React from 'react';
import { useTranslation } from 'react-i18next';

export const NotFound: React.FC<{}> = ({ }) => {

  const { t } = useTranslation();

  return (
    <div className='w-100 flex-fill d-flex flex-column align-items-center justify-content-center'>
      <div className='display-1 fw-bold'>404</div>
      <div className='fs-3 fw-bold'>{t('pages.notFound')}</div>
    </div>
  );
};

export default NotFound;
