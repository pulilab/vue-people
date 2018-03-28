export const gitHubUserProfile = () => ({
  query: `{ viewer {
          name,
          email,
          login,
          avatarUrl
          }
      }`
});

export const gitHubUserRepositories = (login) => ({
  query: `{ user(login: "${login}") {
          repositories(first: 100, privacy: PUBLIC) {
            edges {
              node {
                name,
                url,
                stargazers {
                  totalCount
                },
                languages(first: 5 orderBy: {field: SIZE, direction: DESC}) {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
          repositoriesContributedTo(first: 100 privacy: PUBLIC) {
            edges {
              node {
                name,
                url,
                stargazers {
                  totalCount
                },
                languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
                  edges {
                    node {
                      name
                    }
                  }
                }
              }
            }
          }
        }
      }`
});
