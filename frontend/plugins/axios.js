export const isDjangoAPIRequest = (url) => {
  const pieces = url.split('/').filter(p => p !== '');
  const djangoPaths = ['api'];
  return !!(pieces && djangoPaths.includes(pieces[0]));
};

export default function ({ $axios, store: { getters } }) {
  $axios.interceptors.request.use(config => {
    if (isDjangoAPIRequest(config.url)) {
      config.headers['x-csrftoken'] = getters['user/getCsrfToken'];
    }
    return config;
  });
}
