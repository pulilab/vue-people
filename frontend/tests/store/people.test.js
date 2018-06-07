import { state, getters, actions, mutations } from '~/store/people';
import { mockAxios } from '../utils';
import * as githubQueries from '~/integrations/github/queries';
import * as githubUtils from '~/integrations/github/utilities';
import * as parsersUtils from '~/utilities/parsers';

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
    jest.spyOn(parsersUtils, 'latLngParser');
    const getCurrentPerson = 1;
    const rootGetters = {
      'user/getUserProfile': {id: 2}
    };
    s.list = [
      { id: 1, location: { lat: 2, lng: 3 } },
      {id: 2, location: { lat: 4, lng: 5 }},
      {id: 3, type: 3}
    ];
    const result = getters.getList(s, {getCurrentPerson}, {}, rootGetters);
    expect(result).toEqual([
      {id: 1, selected: true, latlng: { lat: 2, lng: 3 }, type: 1, location: undefined},
      {id: 3, selected: false, type: 3, latlng: undefined, location: undefined}
    ]);
    expect(parsersUtils.latLngParser).toHaveBeenCalledTimes(2);
  });

  test('getCurrentPerson', () => {
    expect(getters.getCurrentPerson(s)).toEqual(s.current);
  });

  test('getPersonDetails', () => {
    const getList = [{id: 1}, {id: 2}];
    const rootGetters = {
      'user/getUserProfile': null
    };
    let result = getters.getPersonDetails(s, {getList}, {}, rootGetters)(1);
    expect(result).toEqual(getList[0]);
    expect(result).not.toBe(getList[0]);

    rootGetters['user/getUserProfile'] = { id: 1 };
    result = getters.getPersonDetails(s, {getList}, {}, rootGetters)(1);
    expect(result).toEqual(rootGetters['user/getUserProfile']);
    expect(result).not.toBe(rootGetters['user/getUserProfile']);
  });

  test('getCurrentPersonDetails', () => {
    const getCurrentPerson = 1;
    const getPersonDetails = jest.fn();
    getters.getCurrentPersonDetails(s, {getCurrentPerson, getPersonDetails});
    expect(getPersonDetails.mock.calls[0]).toEqual([1]);
  });

  test('getCurrentPersonRepositories', () => {
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

    const result = getters.getCurrentPersonRepositories(s);
    expect(result[0].node.stargazers.totalCount).toEqual(2);
  });

  test('getCurrentPersonContributed', () => {
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
    const result = getters.getCurrentPersonContributed(s);
    expect(result[0].node.stargazers.totalCount).toEqual(2);
  });

  test('getSelectedTags', () => {
    s.selectedTags = [1, 2, 3];
    const result = getters.getSelectedTags(s);
    expect(result).toEqual(s.selectedTags);
    expect(result).not.toBe(s.selectedTags);
  });
});

describe('actions', () => {
  const vuex = {};

  beforeEach(() => {
    vuex.commit = jest.fn();
    actions.$axios = mockAxios();
  });

  test('loadPeople', async () => {
    actions.$axios.get.mockReturnValue({data: [1]});
    parsersUtils.apiReadParser = jest.fn().mockReturnValue(1);
    await actions.loadPeople(vuex);
    expect(actions.$axios.get.mock.calls[0]).toEqual(['/api/people/']);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_PEOPLE_LIST', [1]]);
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

    vuex.rootGetters = {
      'user/getGithubToken': undefined
    };

    githubQueries.gitHubUserRepositories = jest.fn().mockReturnValue('query');
    githubUtils.filterOutNonVue = jest.fn().mockReturnValue('filtered');
    githubUtils.gitHubGraphQlRequest = jest.fn().mockReturnValue({
      url: 'url',
      options: 'options'
    });
    let result = await actions.loadRepositories(vuex);
    expect(actions.$axios.post.mock.calls[0]).toEqual(['url', 'query', 'options']);
    expect(githubUtils.filterOutNonVue.mock.calls[0]).toEqual(['repoEdges']);
    expect(githubUtils.filterOutNonVue.mock.calls[1]).toEqual(['contributedEdges']);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_CURRENT_PERSON_REPOSITORY_LIST', 'filtered']);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_CURRENT_PERSON_CONTRIBUTED_LIST', 'filtered']);
    expect(result).toBe(true);

    actions.$axios.post.mockReturnValue({});
    result = await actions.loadRepositories(vuex);
    expect(result).toBe(false);

    actions.$axios.post.mockReturnValue({data: {}});
    result = await actions.loadRepositories(vuex);
    expect(result).toBe(false);

    actions.$axios.post.mockReturnValue({data: {data: {}}});
    result = await actions.loadRepositories(vuex);
    expect(result).toBe(false);

    jest.spyOn(console, 'error').mockReturnValue(undefined);
    actions.$axios.post.mockRejectedValue('error');
    result = await actions.loadRepositories(vuex);
    expect(result).toBe(false);
    expect(console.error).toHaveBeenCalledWith('error');
  });

  test('setSelectedTags', () => {
    actions.setSelectedTags(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_SELECTED_TAGS', 1]);
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

  test('SET_SELECTED_TAGS', () => {
    const s = {};
    mutations.SET_SELECTED_TAGS(s, [1]);
    expect(s.selectedTags).toEqual([1]);
  });
});
