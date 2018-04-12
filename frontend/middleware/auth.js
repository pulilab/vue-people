import { getTokensFromCookie, getTokensFromLocalStorage } from '../utilities/auth';

export default async function ({store, req}) {
  const tokens = process.server ? getTokensFromCookie(req) : getTokensFromLocalStorage();
  if (tokens && tokens.sessionid) {
    await store.dispatch('user/setSessionId', tokens.sessionid);
  }
  if(tokens && tokens.github) {
    await store.dispatch('user/setGithubToken', tokens.github);
  }
  if(tokens && tokens.csrftoken) {
    await store.dispatch('user/setCsrfToken', tokens.csrftoken);
  }
}
