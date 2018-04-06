import  { saveTokens, deleteTokens } from '~/utilities/auth';
export default ({store}) => {
  const githubToken = store.getters['user/getGithubToken'];
  if (githubToken) {
    saveTokens(null, githubToken);
  } else {
    deleteTokens(['github_token']);
  }
};
