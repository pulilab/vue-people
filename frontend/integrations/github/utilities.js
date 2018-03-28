export const gitHubGraphQlRequest = () => {
  const url = 'https://api.github.com/graphql';
  const headers = {
    'Authorization': `bearer ${process.env.gitHubApiKey}`
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
