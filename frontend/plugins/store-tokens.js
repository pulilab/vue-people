import { saveTokens, deleteTokens } from '~/utilities/auth';

export default ({store}) => {
  const githubToken = store.getters['user/getGithubToken'];
  const sessionid = store.getters['user/getSessionId'];
  const csrftoken = store.getters['user/getCsrfToken'];

  if (sessionid && githubToken && csrftoken) {
    saveTokens(sessionid, githubToken, csrftoken);
  } else {
    deleteTokens(['sessionid', 'github_token', 'csrftoken']);
  }
};
