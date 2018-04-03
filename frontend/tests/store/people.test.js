import { state, getters, actions, mutations } from '~/store/people';
import { mockAxios } from '../utils';
import * as githubQueries from '~/integrations/github/queries';;
import * as githubUtils from '~/integrations/github/utilities';

test('people state is unique between calls', () => {
  const s = state();
  expect(s).not.toBe(state());
  expect(s).toEqual(state());
});

describe('getters', () => {
  let s = null;

  beforeEach(() => {
    s = state();
  });

  test('getList', () => {
    s.list = [{a: 1, latitude: 2, longitude: 3}];
    expect(getters.getList(s)).toEqual(
      [{a: 1, latitude: 2, longitude: 3, latlng: {
        lat: 2,
        lng: 3
      }}]
    );
  });

  test('getCurrentPerson', () => {
    expect(getters.getCurrentPerson(s)).toEqual(s.current);
  });

  test('getCurrentPersonDetails', () => {
    const getCurrentPerson = 1;
    const getList = [{id:1, name: 2}];
    const result = getters.getCurrentPersonDetails(s, {getCurrentPerson, getList});
    expect(result).toEqual({id:1, name: 2});
  });

  test('getRepositoriesDefaultSort', () => {
    expect(getters.getRepositoriesDefaultSort(s)).toEqual(s.repositoriesDefaultSort);
  });

  test('getContributedDefaultSort', () => {
    expect(getters.getContributedDefaultSort(s)).toEqual(s.contributedDefaultSort);
  });

  test('getCurrentPersonRepositories', () => {
    let getRepositoriesDefaultSort = 'asc';
    s.currentPersonRepositories = [
      {
        node: {
          stargazers: {
            totalCount: 1
          }
        }
      },
      {
        node: {
          stargazers: {
            totalCount: 2
          }
        }
      }
    ];
    let result = getters.getCurrentPersonRepositories(s, {getRepositoriesDefaultSort});
    expect(result[0].node.stargazers.totalCount).toEqual(1);

    getRepositoriesDefaultSort = 'desc';
    result = getters.getCurrentPersonRepositories(s, {getRepositoriesDefaultSort});
    expect(result[0].node.stargazers.totalCount).toEqual(2);
  });

  test('getCurrentPersonContributed', () => {
    let getContributedDefaultSort = 'asc';
    s.currentPersonContributed = [
      {
        node: {
          stargazers: {
            totalCount: 1
          }
        }
      },
      {
        node: {
          stargazers: {
            totalCount: 2
          }
        }
      }
    ];
    let result = getters.getCurrentPersonContributed(s, {getContributedDefaultSort});
    expect(result[0].node.stargazers.totalCount).toEqual(1);

    getContributedDefaultSort = 'desc';
    result = getters.getCurrentPersonContributed(s, {getContributedDefaultSort});
    expect(result[0].node.stargazers.totalCount).toEqual(2);
  });
});

describe('actions', () => {
  const vuex = {};

  beforeEach(() => {
    vuex.commit = jest.fn();
    actions.$axios = mockAxios();
  });

  test('loadPeople', async () => {
    actions.$axios.get.mockReturnValue({data: 1});
    await actions.loadPeople(vuex);
    expect(actions.$axios.get.mock.calls[0]).toEqual(['/people.json']);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_PEOPLE_LIST',1]);
  });

  test('setCurrent', () => {
    actions.setCurrent(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_CURRENT', 1]);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_CURRENT_PERSON_REPOSITORY_LIST', []]);
    expect(vuex.commit.mock.calls[2]).toEqual(['SET_CURRENT_PERSON_CONTRIBUTED_LIST', []]);
  });

  test('loadRepositories', async () => {
    actions.$axios.post.mockReturnValue({
      data: {
        data: {
          user: {
            repositories: {
              edges: 'repoEdges'
            },
            repositoriesContributedTo: {
              edges: 'contributedEdges'
            }
          }
        }
      }
    });
    vuex.getters = {
      getCurrentPersonDetails: {
        gitHubLogin: 1
      }
    };
    githubQueries.gitHubUserRepositories = jest.fn().mockReturnValue('query');
    githubUtils.filterOutNonVue = jest.fn().mockReturnValue('filtered');
    githubUtils.gitHubGraphQlRequest = jest.fn().mockReturnValue({
      url: 'url',
      options: 'options'
    });
    await actions.loadRepositories(vuex);
    expect(actions.$axios.post.mock.calls[0]).toEqual(['url', 'query', 'options']);
    expect(githubUtils.filterOutNonVue.mock.calls[0]).toEqual(['repoEdges']);
    expect(githubUtils.filterOutNonVue.mock.calls[1]).toEqual(['contributedEdges']);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_CURRENT_PERSON_REPOSITORY_LIST', 'filtered']);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_CURRENT_PERSON_CONTRIBUTED_LIST', 'filtered']);
  });

  test('setRepositoriesDefaultSort', () => {
    actions.setRepositoriesDefaultSort(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_REPOSITORIES_DEFAULT_SORT', 1]);
  });

  test('setContributedDefaultSort', () => {
    actions.setContributedDefaultSort(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_CONTRIBUTED_DEFAULT_SORT', 1]);
  });

});

describe('mutations', () => {

  test('SET_PEOPLE_LIST', () => {
    const s = {};
    mutations.SET_PEOPLE_LIST(s, 1);
    expect(s.list).toEqual(1);
  });

  test('SET_CURRENT', () => {
    const s = {};
    mutations.SET_CURRENT(s, 1);
    expect(s.current).toEqual(1);
  });

  test('SET_CURRENT_PERSON_REPOSITORY_LIST', () => {
    const s = {};
    mutations.SET_CURRENT_PERSON_REPOSITORY_LIST(s, 1);
    expect(s.currentPersonRepositories).toEqual(1);
  });

  test('SET_CURRENT_PERSON_CONTRIBUTED_LIST', () => {
    const s = {};
    mutations.SET_CURRENT_PERSON_CONTRIBUTED_LIST(s, 1);
    expect(s.currentPersonContributed).toEqual(1);
  });

  test('SET_REPOSITORIES_DEFAULT_SORT', () => {
    const s = {};
    mutations.SET_REPOSITORIES_DEFAULT_SORT(s, 1);
    expect(s.repositoriesDefaultSort).toEqual(1);
  });

  test('SET_CONTRIBUTED_DEFAULT_SORT', () => {
    const s = {};
    mutations.SET_CONTRIBUTED_DEFAULT_SORT(s, 1);
    expect(s.contributedDefaultSort).toEqual(1);
  });


});
