import { getTokensFromCookie, getTokensFromLocalStorage } from '../utilities/auth';

export default async function ({store, req}) {
  const tokens = process.server ? getTokensFromCookie(req) : getTokensFromLocalStorage();
  if (tokens && tokens.jwt) {
    await store.dispatch('user/setTokens', tokens.jwt);
  }
  if(tokens && tokens.github) {
    await store.dispatch('user/setGithubToken', tokens.github);
  }
}
