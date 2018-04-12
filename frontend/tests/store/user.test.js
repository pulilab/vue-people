import { state, getters, actions, mutations } from '~/store/user';
import * as githubQueries from '~/integrations/github/queries';;
import * as githubUtils from '~/integrations/github/utilities';
import * as authUtils from '~/utilities/auth';
import { mockAxios } from '../utils';

test('user state is unique between calls', () => {
  const s = state();
  expect(s).not.toBe(state());
  expect(s).toEqual(state());
});

describe('getters', () => {
  let s = null;

  beforeEach(() => {
    s = state();
  });

  test('getUserProfile', () => {
    s.savedProfile = { a: 1, b: 2, type: 2};
    expect(getters.getUserProfile(s)).toEqual(s.savedProfile);
    expect(getters.getUserProfile(s)).not.toBe(s.savedProfile);
  });

  test('getLoginStatus', () => {
    let getUserProfile = undefined;
    let result = getters.getLoginStatus(s, {getUserProfile});
    expect(result).toBe(false);

    getUserProfile = {};
    result = getters.getLoginStatus(s, {getUserProfile});
    expect(result).toBe(false);

    getUserProfile.name = 1;
    result = getters.getLoginStatus(s, {getUserProfile});
    expect(result).toBe(false);

    getUserProfile.avatarUrl = 2;
    result = getters.getLoginStatus(s, {getUserProfile});
    expect(result).toBe(true);
  });

  test('getUserPosition', () => {
    let result = getters.getUserPosition(s);
    expect(result).toEqual(undefined);

    s.position = 1;
    result = getters.getUserPosition(s);
    expect(result).toEqual(1);
  });

  test('isPositionSet', () => {
    let getUserPosition = undefined;
    let result = getters.isPositionSet(s, {getUserPosition});
    expect(result).toBe(false);

    getUserPosition = {};
    result = getters.isPositionSet(s, {getUserPosition});
    expect(result).toBe(true);
  });

  test('getGithubToken', () => {
    expect(getters.getGithubToken(s)).toEqual(s.githubToken);
  });

  test('getSessionId', () => {
    expect(getters.getSessionId(s)).toEqual(s.sessionId);
  });

  test('getCsrfToken', () => {
    expect(getters.getCsrfToken(s)).toEqual(s.csrfToken);
  });
});

describe('actions', () => {
  const vuex = {};

  beforeEach(() => {
    vuex.commit = jest.fn();
    vuex.dispatch = jest.fn();
    vuex.getters = {};
    vuex.state = state();
    actions.$axios = mockAxios();
  });

  test('loadGitHubProfile', async () => {
    vuex.getters.getGithubToken = 'ghToken';
    githubUtils.gitHubGraphQlRequest = jest.fn()
      .mockReturnValue({url: 'url', options: 'options'});
    githubQueries.gitHubUserProfile = jest.fn().mockReturnValue(1);
    actions.$axios.post.mockReturnValue({data: { data: { viewer: { a: 1}}}});

    vuex.state.gitHubProfile = 1;
    await actions.loadGitHubProfile(vuex);
    expect(actions.$axios.post.mock.calls.length).toEqual(0);

    vuex.state.gitHubProfile = null;
    await actions.loadGitHubProfile(vuex);
    expect(actions.$axios.post.mock.calls[0]).toEqual(['url', 1, 'options']);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_USER_GITHUB_PROFILE', {a: 1}]);

    actions.$axios.post = jest.fn(() => Promise.reject());
    await expect(actions.loadGitHubProfile(vuex)).rejects;

    actions.$axios.post = jest.fn(() => Promise.reject({response: {}}));
    await expect(actions.loadGitHubProfile(vuex)).rejects;

    actions.$axios.post = jest.fn(() => Promise.reject({response: {status: 400}}));
    await expect(actions.loadGitHubProfile(vuex)).rejects;

    actions.$axios.post = jest.fn(() => Promise.reject({response: {status: 401}}));
    await expect(actions.loadGitHubProfile(vuex)).rejects;
    expect(vuex.dispatch.mock.calls.length).toEqual(1);
    expect(vuex.dispatch.mock.calls[0]).toEqual(['logout']);

  });

  test('loadSavedProfile', async () => {
    const data = { viewer: { a: 1} };
    actions.$axios.get.mockReturnValue({ data });

    vuex.state.savedProfile = 1;
    await actions.loadSavedProfile(vuex);
    expect(vuex.commit.mock.calls.length).toEqual(0);

    vuex.state.savedProfile = null;
    await actions.loadSavedProfile(vuex);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_SAVED_PROFILE', data]);
  });

  test('setUserPosition', () => {
    actions.setUserPosition(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_USER_POSITION', 1]);
  });

  test('logout', () => {
    authUtils.deleteTokens = jest.fn();
    actions.logout(vuex);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_USER_GITHUB_PROFILE', null]);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_GITHUB_TOKEN', null]);
    expect(vuex.commit.mock.calls[2]).toEqual(['SET_SESSION_ID', null]);
    expect(vuex.commit.mock.calls[3]).toEqual(['SET_CSRF_TOKEN', null]);
    expect(authUtils.deleteTokens.mock.calls.length).toEqual(1);
  });

  test('saveUserProfile', async () => {
    const profile = {name: 1};
    const data = { viewer: { a: 1} };
    actions.$axios.post.mockReturnValue({ data });
    await actions.saveUserProfile(vuex, profile);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_SAVED_PROFILE', data]);
  });

  test('setGithubToken', async () => {
    await actions.setGithubToken(vuex, null);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_GITHUB_TOKEN', null]);
    expect(vuex.dispatch.mock.calls.length).toEqual(0);

    await actions.setGithubToken(vuex, 1);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_GITHUB_TOKEN', 1]);
    expect(vuex.dispatch.mock.calls.length).toEqual(1);
    expect(vuex.dispatch.mock.calls[0]).toEqual(['loadGitHubProfile']);
  });

  test('setSessionId', async () => {
    await actions.setSessionId(vuex, null);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_SESSION_ID', null]);
    expect(vuex.dispatch.mock.calls.length).toEqual(0);

    await actions.setSessionId(vuex, 1);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_SESSION_ID', 1]);
    expect(vuex.dispatch.mock.calls.length).toEqual(1);
    expect(vuex.dispatch.mock.calls[0]).toEqual(['loadSavedProfile']);
  });

  test('setCsrfToken', async () => {
    await actions.setCsrfToken(vuex, null);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_CSRF_TOKEN', null]);

    await actions.setCsrfToken(vuex, 1);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_CSRF_TOKEN', 1]);
  });

});

describe('mutations', () => {

  test('SET_USER_GITHUB_PROFILE', () => {
    const s = {};
    mutations.SET_USER_GITHUB_PROFILE(s, 1);
    expect(s.gitHubProfile).toEqual(1);
  });

  test('SET_USER_POSITION', () => {
    const s = {};
    mutations.SET_USER_POSITION(s, 1);
    expect(s.position).toEqual(1);
  });

  test('SET_SAVED_PROFILE', () => {
    const s = {};
    mutations.SET_SAVED_PROFILE(s, 1);
    expect(s.savedProfile).toEqual(1);
  });

  test('SET_GITHUB_TOKEN', () => {
    const s = {};
    mutations.SET_GITHUB_TOKEN(s, 1);
    expect(s.githubToken).toEqual(1);
  });

  test('SET_SESSION_ID', () => {
    const s = {};
    mutations.SET_SESSION_ID(s, 1);
    expect(s.sessionId).toEqual(1);
  });

  test('SET_CSRF_TOKEN', () => {
    const s = {};
    mutations.SET_CSRF_TOKEN(s, 1);
    expect(s.csrfToken).toEqual(1);
  });

});
