import  { saveTokens } from '~/utilities/auth';
export default ({store}) => {
  const githubToken = store.getters['user/getGithubToken'];
  if(githubToken) {
    saveTokens(null, githubToken);
  }
};
