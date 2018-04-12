import Cookie from 'js-cookie';

export const safeSaveToken = (name, value) => {
  if (value) {
    window.localStorage.setItem(name, value);
    Cookie.set(name, value);
  }
};

export const saveTokens = (sessionid, github, csrftoken) => {
  if (process.SERVER_BUILD) return;
  safeSaveToken('sessionid', sessionid);
  safeSaveToken('github_token', github);
  safeSaveToken('csrftoken', csrftoken);
};

export const deleteTokens = (tokens=['sessionid', 'github_token', 'csrftoken']) => {
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
  const sessionid = getValueFromCookie(req, 'sessionid');
  const github = getValueFromCookie(req, 'github_token');
  const csrftoken = getValueFromCookie(req, 'csrftoken');
  return {
    sessionid,
    github,
    csrftoken
  };
};

export const getTokensFromLocalStorage = () => {
  const sessionid =  window.localStorage.getItem('sessionid');
  const github = window.localStorage.getItem('github_token');
  const csrftoken = window.localStorage.getItem('csrftoken');
  return {
    sessionid,
    github,
    csrftoken
  };
};

export const oauthLinkGenerator = provider => {
  return `/accounts/${provider}/login/`;
};
