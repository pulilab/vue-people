module.exports = {
  apps: [
    {
      name: 'vue-people-nuxt',
      script: '/home/people/vue-people/source/frontend/node_modules/nuxt/bin/nuxt-start',
      env: {
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ],
  deploy: {
    production: {
      user: 'people',
      host: '167.99.245.180',
      ref: 'origin/master',
      repo: 'git@github.com:pulilab/vue-people.git',
      path: '/home/people/vue-people/source/',
      'post-deploy': 'cd frontend/ && yarn && yarn build && pm2 startOrRestart ../ecosystem.config.js --env production && pm2 save',
      env: {
        LANG: 'en_US.utf8',
      }
    }
  }
};
