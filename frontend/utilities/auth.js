import Cookie from 'js-cookie';

export const safeSaveToken = (name, value) => {
  if (value) {
    if (process.client) {
      window.localStorage.setItem(name, value);
    }
    Cookie.set(name, value, { expires: 365 });
  }
};

export const saveTokens = (github, cookieAccepted) => {
  if (process.SERVER_BUILD) return;
  safeSaveToken('github_token', github);
  safeSaveToken('cookie_accepted', cookieAccepted);
};

export const deleteTokens = (tokens = ['github_token', 'csrftoken']) => {
  if (process.SERVER_BUILD) {
    return;
  }
  if (process.client) {
    tokens.forEach(t => window.localStorage.removeItem(t));
  }
  tokens.forEach(t => Cookie.remove(t));
};

export const getValueFromCookie = (req, value) => {
  let result = req.headers.cookie.split(';').find(c => c.trim().startsWith(`${value}=`));
  return result ? result.split('=')[1] : null;
};

export const getTokensFromCookie = (req) => {
  if (!req.headers.cookie) return;
  const github = getValueFromCookie(req, 'github_token');
  const csrftoken = getValueFromCookie(req, 'csrftoken');
  const cookieAccepted = getValueFromCookie(req, 'cookie_accepted');
  return {
    github,
    csrftoken,
    cookieAccepted
  };
};

export const getTokensFromLocalStorage = () => {
  const github = window.localStorage.getItem('github_token');
  const csrftoken = window.localStorage.getItem('csrftoken');
  return {
    github,
    csrftoken
  };
};

export const oauthLinkGenerator = provider => {
  return `/accounts/${provider}/login/`;
};
