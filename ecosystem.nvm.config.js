const {
  name,
  repository: { url: repo },
} = require('./package.json');

const nodeVer = 'v18.18.2';

const interpreter = (cmd) => (
  `/home/ubuntu/.nvm/versions/node/${nodeVer}/bin/${cmd}`
);

const postSetup = () => [
  'mkdir -p ../shared/logs ../shared/public ../shared/private',
  'ln -sf ../shared/logs .',
  'ln -sf ../shared/public .',
  'ln -sf ../shared/private .',
].join(' && ');

const postDeploy = (env) => [
  `export PATH=/home/ubuntu/.nvm/versions/node/${nodeVer}/bin:$PATH`,
  'yarn install',
  'yarn build',
  'rm -rf ./.dist',
  'cp -fR ./dist/ ./.dist/',
  `pm2 startOrReload ecosystem.nvm.config.js --env=${env}`,
].join(' && ');

const scripts = (env) => ({
  'post-deploy': postDeploy(env),
  'post-setup': postSetup(env),
});

module.exports = {
  apps: [{
    name,
    script: `${interpreter('node')} ./.dist/server`,
    max_memory_restart: '1G',
    instances: 1,
    exec_mode: 'fork',
    env: { NODE_ENV: 'uat' },
  }],

  deploy: {
    dev: {
      host: '4d-dev',
      ref: 'origin/dev',
      repo,
      path: `/home/ubuntu/www-nodejs/${name}`,
      ...scripts('uat'),
    },
  }
};
