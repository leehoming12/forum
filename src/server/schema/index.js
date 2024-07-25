
const defaultPublicCLP = {
  find: { '*': true },
  get: { '*': true },
  count: { '*': true },
  create: { '*': true },
  update: { '*': true },
  delete: { '*': true },
};

const defaultPublicReadCLP = {
  find: { '*': true },
  get: { '*': true },
  count: { '*': true },
};

const defaultPublicReadWriteCLP = {
  find: { '*': true },
  get: { '*': true },
  count: { '*': true },
  update: { '*': true },
  create: { '*': true },
};

const defaultAdminCLP = (() => {
  const roles = {
    'role:admin': true,
  };
  return {
    find: roles,
    get: roles,
    count: roles,
    create: roles,
    update: roles,
    delete: roles,
  }
})();

export const User = {
  className: '_User',
  fields: {
    'active': { type: 'Boolean' },
  },
  classLevelPermissions: defaultPublicCLP,
}

export const MediaFile = {
  className: 'MediaFile',
  fields: {
    'name': { type: 'String' },
    'file': { type: 'File' },
    'sort_order': { type: 'Number' }
  },
  classLevelPermissions: defaultPublicReadWriteCLP,
}

export const ReactErrorLog = {
  className: 'ReactErrorLog',
  fields: {
    'createdAt': { type: 'Date' },
    'platform': { type: 'Object' },
    'error': { type: 'Object' },
    'info': { type: 'Object' },
  },
  classLevelPermissions: {
    create: { '*': true },
  },
}