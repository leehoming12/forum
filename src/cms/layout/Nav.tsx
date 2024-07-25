import _ from 'lodash';
import React from 'react';
import { I18nPicker } from '../components/I18nPicker';

export const Nav = () => {

  return (
    <div className='row m-0 px-4 align-items-center'>
      <h1 className='col'>AiChatbotCMS</h1>
      <div className='col-auto ms-auto'>
        <I18nPicker variant='outline-dark' />
      </div>
    </div>
  );
};
