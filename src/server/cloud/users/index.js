import _ from 'lodash';
import { addUserToRoles, getUserRoles, userFromRoles } from './methods';
import { withSearchQuery } from '../utils';
import parsePhoneNumber from 'libphonenumber-js';

Parse.Cloud.define('userRoles', (req) => getUserRoles(req.user), {
  requireUser: true,
});

Parse.Cloud.define('userFromRoles', async (req) => {

  const {
    roles,
    search,
    searchBy,
    skip,
    limit,
    sort,
    countOnly,
  } = req.params;

  const query = withSearchQuery(
    await userFromRoles(roles),
    search,
    searchBy,
    ['username', 'email', 'phone.number']
  );

  if (countOnly) return query.count({ useMasterKey: true });

  if (skip) query.skip(skip);
  if (limit) query.limit(limit);
  if (!_.isEmpty(sort)) {
    for (const [k, v] of _.toPairs(sort)) {
      if (k === 'phone') {
        if (v === -1) query.addDescending(['phone.area', 'phone.number']);
        if (v === 1) query.addAscending(['phone.area', 'phone.number']);
      } else {
        if (v === -1) query.addDescending(k);
        if (v === 1) query.addAscending(k);
      }
    }
  }

  return query.find({ useMasterKey: true });

}, {
  requireAnyUserRoles: ['admin'],
});

Parse.Cloud.define('getUser', async (req) => {

  const { id } = req.params;

  const query = new Parse.Query(Parse.User);

  return query.get(id, { useMasterKey: true });

}, {
  requireAnyUserRoles: ['admin'],
});

Parse.Cloud.define('updateUser', async (req) => {

  const {
    id,
    roles,
    values: {
      username,
      password,
      confirmPassword,
      phone,
      ...values
    }
  } = req.params;

  const user = id === 'new' ? new Parse.User : Parse.User.createWithoutData(id);

  if (!_.isEmpty(username)) {
    user.setUsername(username);
  }
  if (!_.isEmpty(password)) {
    user.setPassword(password);
  }

  if (phone) {
    const { area, number } = phone;

    if (!_.isEmpty(area) && !_.isEmpty(number)) {

      const phoneNumber = parsePhoneNumber(`+${area}${number}`);
      if (!phoneNumber?.isValid()) throw Error('invalidPhoneNumber');

      const { countryCallingCode, nationalNumber } = phoneNumber;

      const query = new Parse.Query(Parse.User);
      query.equalTo('phone.area', countryCallingCode);
      query.equalTo('phone.number', nationalNumber);

      const duplicated = await query.find({ useMasterKey: true });
      if (_.some(duplicated, x => x.id !== user.id)) throw Error('duplicatedPhoneNumber');

      user.set('phone', {
        area: countryCallingCode,
        number: nationalNumber,
      });
    } else {
      user.unset('phone');
    }
  }

  for (const [key, value] of _.toPairs(values)) {
    if (!_.isNil(value) && value !== '') {
      user.set(key, value);
    } else {
      user.unset(key);
    }
  }

  await user.save(null, { useMasterKey: true });

  if (id === 'new' && !_.isEmpty(roles)) {
    await addUserToRoles(user, ..._.castArray(roles));
  }

  return user.id;

}, {
  requireAnyUserRoles: ['admin'],
});

Parse.Cloud.define('findUsernameByPhone', async (req) => {

  const { area, number } = req.params;

  if (_.isEmpty(area) || _.isEmpty(number)) return;

  const query = new Parse.Query(Parse.User);
  query.equalTo('phone.area', area);
  query.equalTo('phone.number', number);

  const user = await query.first({ useMasterKey: true });

  return user?.getUsername();
});
