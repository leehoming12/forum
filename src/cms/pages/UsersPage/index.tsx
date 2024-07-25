import _ from 'lodash';
import React from 'react';
import { List } from '~/common/components/list';
import { FaPlus } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import parsePhoneNumber from 'libphonenumber-js';

type UsersPageProps = {
  title: string;
  roles?: string | string[];
};

export const UsersPage: React.FC<UsersPageProps> = ({
  title,
  roles,
}) => {

  const { pathname } = useLocation();
  const [, middle] = pathname.split('/').filter(x => !_.isEmpty(x));
  const { t } = useTranslation();

  return (
    <div className='m-3'>
      <div className='container'>
        <List
          totalCount={(opts) => Parse.Cloud.run('userFromRoles', { ...opts, roles, countOnly: true })}
          resources={(opts) => Parse.Cloud.run('userFromRoles', { ...opts, roles })}
        >

          <div className='row mb-3'>
            <div className='col-auto me-auto'>
              <h2>{t(title, _.startCase(title))}</h2>
            </div>
            <div className='col-auto'>
              <Link
                className='btn btn-primary p-2'
                to={`/cms/${middle}/new`}
              >
                <FaPlus />
              </Link>
            </div>
          </div>

          <div className='row mb-3'>

            <List.Search
              className='col'
              options={[
                { label: t('all'), value: '' },
                { label: t('username'), value: 'username' },
                { label: t('email'), value: 'email' },
                { label: t('phoneNumber'), value: 'phone.number' },
              ]}
            />

            <div className='col-auto'>
              <List.Pagination />
            </div>

            <div className='col-auto'>
              <List.PageLimit />
            </div>

          </div>

          <List.Table
            rowIndex
            rowLink={(item: any) => `/cms/${middle}/${item.id}`}
            defaultSort={{ username: 1 }}
            columns={[
              {
                name: 'username',
                key: 'username',
                sortable: true,
              },
              {
                name: 'email',
                key: 'email',
                sortable: true,
              },
              {
                name: 'phoneNumber',
                key: 'phone',
                getter: (phone) => {
                  if (!phone?.area || !phone?.number) return;
                  const str = `+${phone.area}${phone.number}`;
                  const phoneNumber = parsePhoneNumber(str);
                  return phoneNumber?.formatInternational() ?? str;
                },
                sortable: true,
              },
              {
                name: 'active',
                key: 'active',
                format: 'bool',
                sortable: true,
              },
              {
                name: 'createdAt',
                key: 'createdAt',
                format: 'date',
                sortable: true,
              },
              {
                name: 'updatedAt',
                key: 'updatedAt',
                format: 'date',
                sortable: true,
              },
            ]}
          />

        </List>
      </div>
    </div>
  );
};

export default UsersPage;
