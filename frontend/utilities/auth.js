import Cookie from 'js-cookie';

export const saveTokens = (jwt, github) => {
  if (process.SERVER_BUILD) return;
  if (jwt) {
    window.localStorage.setItem('jwt_token', jwt);
    Cookie.set('jwt_token', jwt);
  }
  if (github) {
    window.localStorage.setItem('github_token', github);
    Cookie.set('github_token', github);
  }
};

export const deleteTokens = (tokens=['jwt_token', 'github_token']) => {
  if (process.SERVER_BUILD) {
    return;
  }
  if (process.client) {
    tokens.forEach(t =>window.localStorage.removeItem(t));
  }
  tokens.forEach(t=> Cookie.remove(t));
};

export const getValueFromCookie = (req, value) => {
  let result = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${value}=`));
  return  result ? result.split('=')[1] : null;
};

export const getTokensFromCookie = (req) => {
  if (!req.headers.cookie) return;
  const jwt = getValueFromCookie(req, 'jwt_token');
  const github = getValueFromCookie(req, 'github_token');
  return {
    jwt,
    github
  };
};

export const getTokensFromLocalStorage = () => {
  const jwt =  window.localStorage.getItem('jwt_token');
  const github = window.localStorage.getItem('github_token');
  return {
    jwt,
    github
  };
};

export const oauthLinkGenerator = provider => {
  return `/accounts/${provider}/login/`;
};
