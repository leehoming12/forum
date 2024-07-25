
import _ from 'lodash';

const roleQuery = new Parse.Query(Parse.Role);
const roles = await roleQuery.find({ useMasterKey: true });

const systemRoles = [
  'admin',
];

const systemRoleAcl = new Parse.ACL;
systemRoleAcl.setPublicReadAccess(true);

for (const role of systemRoles) {
  if (!_.find(roles, x => x.get('name') === role)) {
    const obj = new Parse.Role;
    obj.set('name', role);
    obj.setACL(systemRoleAcl);
    await obj.save(null, { useMasterKey: true });
  }
}
