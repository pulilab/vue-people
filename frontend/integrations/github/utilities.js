export const gitHubGraphQlRequest = (token) => {
  const url = 'https://api.github.com/graphql';
  const headers = {
    'Authorization': `bearer ${token}`
  };
  return { url , options: { headers }};
};

export const filterOutNonVue = (repositories) => {
  return repositories.filter(r => {
    return r.node.languages.edges.reduce((prev, curr) => {
      return prev || curr.node.name === 'Vue';
    }, false);
  });
};

export const gitHubOauthLink = () => {
  return `https://github.com/login/oauth/authorize?scope=user:email&client_id=${process.env.gitHubClientId}`;
};

export const gitHubAccessTokenLink = () => {
  const url = 'https://github.com/login/oauth/access_token';
  const headers = {
    'Accept': `application/json`
  };
  return { url , options: { headers }};
};


export const profileMapper = (ghp) => {
  return {
    name:  ghp.name,
    avatarUrl: ghp.avatarUrl,
    email: ghp.email,
    githubUrl: ghp.url,
    websiteUrl: ghp.websiteUrl,
    organisation: ghp.company,
    about: ghp.bio
  };
};
