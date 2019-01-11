const result = require('dotenv').config();
const path = require('path');

if (result.error) {
  console.log('\x1b[31m%s\x1b[0m', 'Missing .env file, follow the README instructions');
  throw result.error;
}

const config = {
  head: {
    title: 'VuePeople',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'vue people' }
    ],
    link: [
      { rel: 'icon', type: 'image/pmg', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  css: [
    '~/assets/style/vuetify.styl',
    '~/assets/style/main.less'
  ],
  env: {
    gitHubApiKey: process.env.GITHUB_KEY || '',
    webSocketProtocol: process.env.WEBSOCKET_PROTOCOL || 'wss'
  },
  plugins: [
    { src: '~plugins/axios.js', ssr: true },
    { src: '~plugins/vuetify.js', ssr: true },
    { src: '~plugins/vee-validate.js', ssr: true },
    { src: '~plugins/vue-leaflet.js', ssr: false },
    { src: '~plugins/store-tokens.js', ssr: false },
    { src: '~plugins/vue-django-feedback.js', ssr: false },
    { src: '~plugins/web-sockets.js', ssr: false }
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    'nuxt-mq',
    'nuxt-device-detect'
  ],
  proxy: {},
  axios: {
    baseURL: 'http://django:8000/',
    browserBaseURL: '/',
    credentials: true,
    retry: false
  },
  mq: {
    breakpoints: {
      xs: 320,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: Infinity
    }
  },
  router: {
    middleware: ['auth', 'entrypoint-spy']
  },
  loading: { color: '#3B8070' },
  build: {
    extractCSS: true,
    extend (config, { isDev }) {
      if (isDev && process.client) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        });
      }
      config.resolve.alias['leaflet'] = path.join(__dirname, 'node_modules/leaflet');
    }
  }
};

if (process.env.ANALYTICS_ID) {
  config.modules.push('@nuxtjs/google-analytics');
  config['google-analytics'] = {
    id: process.env.ANALYTICS_ID
  };
}

if (process.env.NODE_ENV !== 'production') {
  config.axios = {
    proxy: true,
    credentials: true
  };
  config.proxy = {
    '/api/': { target: 'https://localhost/', secure: false },
    '/accounts/': { target: 'https://localhost/', secure: false, cors: true }
  };
}
module.exports = config;
