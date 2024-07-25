import _ from 'lodash';
import React from 'react';
import { Form } from '~/common/components/form';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import { I18nPicker } from '../../components/I18nPicker';
import { allowedRoles } from '../../consts';
import { useAlert } from '~/common/hooks/alert';

const initialValues = {
  username: '',
  password: '',
};

const schema = object({
  username: string().required(),
  password: string().required(),
});

export const LoginPage: React.FC<{}> = ({ }) => {

  const { t } = useTranslation();
  const showAlert = useAlert();

  return (
    <div className='w-100 d-flex flex-column'>
      <div className='ms-auto p-3'>
        <I18nPicker variant='outline-dark' />
      </div>
      <div className='d-flex flex-fill align-self-center align-items-center justify-content-center'>
        <div>
          <Form
            className='d-flex flex-column gap-3'
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={async ({ username, password }) => {
              const user = await Parse.User.logIn(username, password);
              const userRoles = await Parse.Cloud.run('userRoles');

              if (!user.get('active') || _.isEmpty(_.intersection(allowedRoles, _.map(userRoles, x => x.get('name'))))) {
                await Parse.User.logOut();
                showAlert('danger', t('pages.noAccessRight'), 5000);
              } else {
                window.location.reload();
              }
            }}
          >
            <Form.Input name='username' />
            <Form.Input name='password' type='password' />
            <Form.Button className='btn btn-primary' type='submit'>{t('login')}</Form.Button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
