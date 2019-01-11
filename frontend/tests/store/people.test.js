import { state, getters, actions, mutations } from '~/store/people';
import { mockAxios } from '../utils';
import * as githubQueries from '~/integrations/github/queries';
import * as githubUtils from '~/integrations/github/utilities';
import * as parsersUtils from '~/utilities/parsers';
import * as mediaUtils from '~/utilities/media';
import { WebSocketBridge, connect, listen } from 'django-channels';
jest.mock('django-channels');

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
    const getCurrentPerson = 1;
    const rootGetters = {
      'user/getUserProfile': {id: 2}
    };
    s.list = [
      { id: 1 },
      { id: 2 },
      { id: 3 }
    ];
    const result = getters.getList(s, {getCurrentPerson}, {}, rootGetters);
    expect(result).toEqual([
      { id: 1 },
      { id: 3 }
    ]);
  });

  test('getLatestUser', () => {
    let getList = [{id: 1}, {id: 2, name: 'bob'}, {id: 3, name: 'carl'}];
    let result = getters.getLatestUser(null, {getList});
    expect(result).toBe(3);
    getList = [{id: 1}, {id: 2}, {id: 3}];
    result = getters.getLatestUser(null, {getList});
    expect(result).toBe(null);
  });

  test('getCurrentPerson', () => {
    expect(getters.getCurrentPerson(s)).toEqual(s.current);
  });

  test('getPersonDetails', () => {
    const list = [{id: 1}, {id: 2}];
    const peopleLibrary = {
      1: { id: 1 },
      2: { id: 2 }
    };
    const rootGetters = {
      'user/getUserProfile': null
    };
    let result = getters.getPersonDetails({peopleLibrary: {}, list}, {}, {}, rootGetters)(1);
    expect(result).toEqual(list[0]);
    expect(result).not.toBe(list[0]);

    result = getters.getPersonDetails({peopleLibrary}, {}, {}, rootGetters)(1);
    expect(result).toEqual(list[0]);
    expect(result).not.toBe(list[0]);

    rootGetters['user/getUserProfile'] = { id: 1 };
    result = getters.getPersonDetails({peopleLibrary}, {}, {}, rootGetters)(1);
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
    vuex.state = null;
    vuex.rootGetters = null;
    vuex.dispatch = jest.fn();
    actions.$axios = mockAxios();
    WebSocketBridge.mockClear();
    listen.mockClear();
    connect.mockClear();
  });

  test('loadPeople', async () => {
    actions.$axios.get.mockReturnValue({data: [1]});
    const mockResult = { a: 1, latlng: 1 };
    parsersUtils.personParser = jest.fn().mockReturnValue(mockResult);
    await actions.loadPeople(vuex);
    expect(actions.$axios.get.mock.calls[0]).toEqual(['/api/people/']);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_PEOPLE_LIST', [mockResult]]);
  });

  test('setCurrent', async () => {
    actions.$axios.get.mockReturnValue({data: [1]});
    const mockResult = { a: 1, latlng: 1 };
    parsersUtils.personParser = jest.fn().mockReturnValue(mockResult);
    await actions.setCurrent(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_PERSON', {id: 1, person: mockResult}]);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_CURRENT', 1]);
    expect(vuex.commit.mock.calls[2]).toEqual(['SET_CURRENT_PERSON_REPOSITORY_LIST', []]);
    expect(vuex.commit.mock.calls[3]).toEqual(['SET_CURRENT_PERSON_CONTRIBUTED_LIST', []]);

    await actions.setCurrent(vuex, null);
    expect(vuex.commit.mock.calls[4]).toEqual(['SET_CURRENT', null]);
    expect(vuex.commit.mock.calls[5]).toEqual(['SET_CURRENT_PERSON_REPOSITORY_LIST', []]);
    expect(vuex.commit.mock.calls[6]).toEqual(['SET_CURRENT_PERSON_CONTRIBUTED_LIST', []]);
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
    githubUtils.filterOutNonVueAndZeroStars = jest.fn().mockReturnValue('filtered');
    githubUtils.gitHubGraphQlRequest = jest.fn().mockReturnValue({
      url: 'url',
      options: 'options'
    });
    let result = await actions.loadRepositories(vuex);
    expect(actions.$axios.post.mock.calls[0]).toEqual(['url', 'query', 'options']);
    expect(githubUtils.filterOutNonVueAndZeroStars.mock.calls[0]).toEqual(['repoEdges']);
    expect(githubUtils.filterOutNonVueAndZeroStars.mock.calls[1]).toEqual(['contributedEdges']);
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

  test('setSelectedTags', async () => {
    actions.$axios = jest.fn((config) => {
      config.paramsSerializer([]);
      return {
        data: [{id: 1}]
      };
    });
    await actions.setSelectedTags(vuex, [{id: 1}]);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_SELECTED_TAGS', [{id: 1}]]);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_FILTERED', [1]]);
  });

  test('openSocket', () => {
    actions.openSocket(vuex);
    expect(WebSocketBridge).toHaveBeenCalled();
    expect(connect).toHaveBeenCalled();
    expect(listen).toHaveBeenCalled();
    expect(vuex.dispatch).toHaveBeenCalled();
  });

  test('socketAction', () => {
    const parserSpy = jest.spyOn(parsersUtils, 'personParser').mockReturnValue({id: 2});
    jest.spyOn(mediaUtils, 'playDing').mockReturnValue(undefined);
    actions.socketAction(vuex);
    expect(vuex.commit).not.toHaveBeenCalled();

    actions.socketAction(vuex, {});
    expect(vuex.commit).not.toHaveBeenCalled();
    vuex.state = {
      list: []
    };
    vuex.rootGetters = {
      'user/getSettings': {}
    };
    actions.socketAction(vuex, {person: { id: 1 }});
    expect(vuex.commit).toHaveBeenCalledWith('ADD_PERSON', {id: 2});
    expect(mediaUtils.playDing).not.toHaveBeenCalled();

    parserSpy.mockReturnValue({name: 'evan'});
    actions.socketAction(vuex, {person: { id: 1 }});
    expect(vuex.commit).toHaveBeenCalledWith('ADD_PERSON', {id: 2});
    expect(mediaUtils.playDing).not.toHaveBeenCalled();

    vuex.rootGetters['user/getSettings'].ding = true;
    actions.socketAction(vuex, {person: { id: 1 }});
    expect(vuex.commit).toHaveBeenCalledWith('ADD_PERSON', {id: 2});
    expect(mediaUtils.playDing).toHaveBeenCalled();

    mediaUtils.playDing.mockClear();

    vuex.rootGetters['user/getSettings'].ding = false;
    parserSpy.mockReturnValue(2);
    vuex.state.list = [{id: 1}];
    actions.socketAction(vuex, {person: { id: 1 }});
    expect(vuex.commit).toHaveBeenCalledWith('UPDATE_PERSON', {index: 0, person: 2});
    expect(mediaUtils.playDing).not.toHaveBeenCalled();

    vuex.rootGetters['user/getSettings'].ding = true;
    parserSpy.mockReturnValue({name: 'evan'});
    vuex.state.list = [{id: 1, name: 'bob'}];
    actions.socketAction(vuex, {person: { id: 1 }});
    expect(vuex.commit).toHaveBeenCalledWith('UPDATE_PERSON', {index: 0, person: {name: 'evan'}});
    expect(mediaUtils.playDing).not.toHaveBeenCalled();

    vuex.rootGetters['user/getSettings'].ding = true;
    parserSpy.mockReturnValue({name: 'evan'});
    vuex.state.list = [{id: 1, name: undefined}];
    actions.socketAction(vuex, {person: { id: 1 }});
    expect(vuex.commit).toHaveBeenCalledWith('UPDATE_PERSON', {index: 0, person: {name: 'evan'}});
    expect(mediaUtils.playDing).toHaveBeenCalled();
  });

  test('closeSocket', () => {
    vuex.state = {
      peopleWebSocketBridge: {
        socket: {
          close: jest.fn()
        }
      }
    };
    actions.closeSocket(vuex);
    expect(vuex.commit).toHaveBeenCalledWith('SET_PEOPLE_WEBSOCKET_BRIDGE', null);
    expect(vuex.state.peopleWebSocketBridge.socket.close).toHaveBeenCalled();
  });

  test('deletePerson', () => {
    actions.deletePerson(vuex, 1);
    expect(vuex.commit).toHaveBeenLastCalledWith('DELETE_PERSON', 1);
  });
});

describe('mutations', () => {
  test('SET_PEOPLE_LIST', () => {
    const s = {};
    mutations.SET_PEOPLE_LIST(s, 1);
    expect(s.list).toEqual(1);
  });

  test('ADD_PERSON', () => {
    const s = {
      list: [],
      peopleLibrary: {}
    };
    mutations.ADD_PERSON(s, {id: 1});
    expect(s.list).toEqual([{id: 1}]);
    expect(s.peopleLibrary[1]).toEqual({id: 1});
  });
  test('SET_PERSON', () => {
    const s = {
      peopleLibrary: {}
    };
    mutations.SET_PERSON(s, {id: 1, person: {id: 1}});
    expect(s.peopleLibrary[1]).toEqual({id: 1});
  });

  test('UPDATE_PERSON', () => {
    const s = {
      list: [{id: 2}],
      peopleLibrary: {1: {id: 2}}
    };
    mutations.UPDATE_PERSON(s, {person: {id: 1}, index: 0});
    expect(s.list).toEqual([{id: 1}]);
    expect(s.peopleLibrary[1]).toEqual({id: 1});
  });

  test('DELETE_PERSON', () => {
    const s = {
      list: [{id: 1}, {id: 2}],
      peopleLibrary: {
        1: 1,
        2: 2
      }
    };
    mutations.DELETE_PERSON(s, 1);
    expect(s.list).toEqual([{id: 2}]);
    expect(s.peopleLibrary).toEqual({2: 2});
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

  test('SET_PEOPLE_WEBSOCKET_BRIDGE', () => {
    const s = {};
    mutations.SET_PEOPLE_WEBSOCKET_BRIDGE(s, 1);
    expect(s.peopleWebSocketBridge).toEqual(1);
  });

  test('SET_FILTERED', () => {
    const s = {};
    mutations.SET_FILTERED(s, 1);
    expect(s.filtered).toEqual(1);
  });
});
