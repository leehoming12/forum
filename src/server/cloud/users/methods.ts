import _ from 'lodash';

export const getUserRoles = async (user: Parse.User) => {

  const roles = await new Parse.Query(Parse.Role).equalTo('users', user).findAll({ useMasterKey: true });
  if (_.isEmpty(roles)) return [];

  while (true) {

    const query = new Parse.Query(Parse.Role);
    query.notContainedIn('objectId', roles.map(x => x.id));
    query.equalTo('roles', roles);

    const children = await query.findAll({ useMasterKey: true });

    if (_.isEmpty(children)) return roles;
    roles.push(...children);
  }
}

export const userFromRoles = async (roles?: string | string[]) => {

  if (_.isEmpty(roles)) {
    const roleQuery = new Parse.Query(Parse.Role);
    const roleObjs = await roleQuery.findAll({ useMasterKey: true });
    const exclude = Parse.Query.or(..._.map(roleObjs, x => x.getUsers().query()));

    const query = new Parse.Query(Parse.User);
    return query.doesNotMatchKeyInQuery('objectId', 'objectId', exclude);
  }

  const query = new Parse.Query(Parse.Role);
  query.containedIn('name', _.castArray(roles));
  const roleObjs = await query.findAll({ useMasterKey: true });

  if (roleObjs.length === 1) {
    return roleObjs[0].getUsers().query();
  }

  return Parse.Query.or(..._.map(roleObjs, x => x.getUsers().query()));
}

export const addUserToRoles = async (user: Parse.User, ...roles: string[]) => {
  const roleQuery = new Parse.Query(Parse.Role);
  const objs = await roleQuery.containedIn('name', roles).findAll({ useMasterKey: true });
  for (const obj of objs) {
    obj.getUsers().add(user);
  }
  await Promise.all(_.map(objs, o => o.save(null, { useMasterKey: true })));
}
