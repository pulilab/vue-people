import { getTokensFromCookie, getTokensFromLocalStorage } from '../utilities/auth';

export default async function ({store, req}) {
  const tokens = process.server ? getTokensFromCookie(req) : getTokensFromLocalStorage();
  if (tokens && tokens.github) {
    await store.dispatch('user/setGithubToken', tokens.github);
  }
  if (tokens && tokens.csrftoken) {
    await store.dispatch('user/setCsrfToken', tokens.csrftoken);
  }
  if (tokens && tokens.cookieAccepted) {
    const showCookies = tokens.cookieAccepted !== 'true';
    await store.dispatch('setShowCookieWarning', showCookies);
  }
}
