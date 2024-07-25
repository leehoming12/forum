const {
  name,
  repository: { url: repo },
} = require('./package.json');

const postSetup = () => [
  'mkdir -p ../shared/logs ../shared/public ../shared/private',
  'ln -sf ../shared/logs .',
  'ln -sf ../shared/public .',
  'ln -sf ../shared/private .',
].join(' && ');

const postDeploy = (env) => [
  'yarn install',
  'yarn build',
  'rm -rf ./.dist',
  'cp -fR ./dist/ ./.dist/',
  `pm2 startOrReload ecosystem.config.js --env=${env}`,
].join(' && ');

const scripts = (env) => ({
  'post-deploy': postDeploy(env),
  'post-setup': postSetup(env),
});

module.exports = {
  apps: [{
    name,
    script: 'node ./.dist/server',
    max_memory_restart: '1G',
    instances: 'max',
    env: { NODE_ENV: 'development' },
    env_uat: { NODE_ENV: 'uat' },
    env_prd: { NODE_ENV: 'production' },
    time: true,
  }],

  deploy: {
    uat: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      repo,
      path: `/home/ubuntu/www-nodejs/${name}`,
      ...scripts('uat'),
    },
  }
};