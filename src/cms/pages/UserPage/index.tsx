import _ from 'lodash';
import React from 'react';
import { object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Form } from '~/common/components/form';
import { useAsyncResource } from 'sugax';
import { useAlert } from '~/common/hooks/alert';

type UserPageProps = {
  title: string;
  roles?: string | string[];
};

const initialValues = {
  username: '',
  email: '',
  phone: {
    area: '',
    number: '',
  },
  password: '',
  confirmPassword: '',
};

const schema = object({
  username: string().required(),
  email: string(),
  phone: object({
    area: string(),
    number: string(),
  }),
  password: string(),
  confirmPassword: string(),
});

export const UserPage: React.FC<UserPageProps> = ({
  title,
  roles,
}) => {

  const { t } = useTranslation();
  const { id } = useParams();

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const showAlert = useAlert();

  const {
    resource: doc,
    count: ready,
  } = useAsyncResource(async () => id === 'new' ? initialValues : Parse.Cloud.run('getUser', { id }));

  return (
    <div className='m-3'>
      {ready && <Form
        className='container'
        initialValues={doc}
        validationSchema={schema}
        onSubmit={async (values) => {
          if (values.confirmPassword !== values.password) {
            throw Error(t('pages.confirmPasswordNotMatch'));
          }
          const userId = await Parse.Cloud.run('updateUser', { id, roles, values });
          const [, middle] = pathname.split('/').filter(x => !_.isEmpty(x));
          navigate(`/cms/${middle}/${userId}`, { replace: true });
          showAlert('success', t('saveSuccess'), 5000);
        }}
      >

        <div className='row mb-3'>
          <div className='col-auto me-auto'>
            <h2>{t(id === 'new' ? 'commons.pageCreateTitle' : 'commons.pageEditTitle', { title })}</h2>
          </div>
          <div className='col-auto'>
            <Form.Button className='btn btn-secondary' type='reset'>{t('reset')}</Form.Button>
          </div>
          <div className='col-auto'>
            <Form.Button className='btn btn-primary' type='submit'>{t('save')}</Form.Button>
          </div>
        </div>

        <div className='row'>
          <Form.Switch name='active' label='' className='col-12 col-md-6 mb-3'>
            <label htmlFor='active'>{t('active')}</label>
          </Form.Switch>
        </div>

        <div className='row'>
          <h6 className='border-bottom text-muted py-1 pt-4 mb-3'>{t('pages.userBasicInfo')}</h6>
          <Form.Input name='username' className='col-12 col-md-6 mb-3' />
          <Form.Input name='email' className='col-12 col-md-6 mb-3' />
          <Form.Input name='phone.area' label='phoneArea' className='col-12 col-md-6 mb-3' />
          <Form.Input name='phone.number' label='phoneNumber' className='col-12 col-md-6 mb-3' />
        </div>

        <div className='row'>
          <h6 className='border-bottom text-muted py-1 pt-4 mb-3'>{t('pages.userSecurity')}</h6>
          <Form.Input name='password' className='col-12 col-md-6 mb-3' type='password' />
          <Form.Input name='confirmPassword' className='col-12 col-md-6 mb-3' type='password' />
        </div>
      </Form>}
    </div>
  );
};

export default UserPage;
