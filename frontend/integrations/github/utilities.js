export const gitHubGraphQlRequest = () => {
  const url = 'https://api.github.com/graphql';
  const headers = {
    'Authorization': `bearer ${process.env.gitHubApiKey}`
  };
  return { url , options: { headers }};
};

export const filterOutNonVue = (repositories) => {};
