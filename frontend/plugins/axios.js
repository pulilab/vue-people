import { getTokensFromCookie } from '~/utilities/auth';

export const isDjangoAPIRequest = (url) => {
  const pieces = url.split('/').filter(p => p !== '');
  return !!(pieces && pieces[0] === 'api');
};

export default function ({ $axios, store: { getters } }) {

  $axios.interceptors.request.use(config => {
    if (isDjangoAPIRequest(config.url)) {
      config.headers['x-csrftoken'] = getters['user/getCsrfToken'];
    }
    return config;
  });
}
