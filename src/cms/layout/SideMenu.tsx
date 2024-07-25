import _ from 'lodash';
import React from 'react';
import { ParseContext } from '~/common/components/parse';
import { useTranslation } from 'react-i18next';
import { FaPowerOff } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { SideMenuRoute, sideMenu } from '../routes';
import { useParseUserRoles } from '~/common/hooks/parse';

export const roleCheck = (roles: SideMenuRoute[], userRoles: string[]) => _.filter(roles, x => !x.roles || !_.isEmpty(_.intersection(x.roles, userRoles)));

const Section = ({ path, name, icon, children }: SideMenuRoute) => {
  const userRoles = useParseUserRoles();
  const _children = roleCheck(children ?? [], userRoles);
  const { t } = useTranslation();
  return (
    <>
      {path ? (
        <Link
          to={path}
          className='text-decoration-none link-dark'
        >{icon}{t(name, _.startCase(name))}</Link>
      ) : (
        <span className='text-decoration-none link-dark'>{icon}{t(name, _.startCase(name))}</span>
      )}
      {!_.isEmpty(_children) && (
        <div className='d-flex flex-column ms-3 gap-3'>
          {_.map(_children, (route) => (
            <Section key={route.path ?? route.name} {...route} />
          ))}
        </div>
      )}
    </>
  );
}

export const SideMenu = () => {

  const userRoles = useParseUserRoles();
  const { refresh } = React.useContext(ParseContext);
  const { t } = useTranslation();

  return (
    <div className='d-flex flex-column m-4 w-100 gap-3'>
      <div className='d-flex flex-column gap-3'>
        {_.map(roleCheck(sideMenu, userRoles), (route) => (
          <Section key={route.path ?? route.name} {...route} />
        ))}
      </div>
      <a
        className='mt-auto text-decoration-none align-self-center'
        onClick={async () => {
          await Parse.User.logOut();
          refresh();
        }}
      ><FaPowerOff className='me-2' />{t('logout')}</a>
    </div>
  );
};
