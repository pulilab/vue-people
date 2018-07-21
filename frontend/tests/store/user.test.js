/* eslint prefer-promise-reject-errors: 0 */
import { state, getters, actions, mutations } from '~/store/user';
import * as authUtils from '~/utilities/auth';
import * as parsersUtils from '~/utilities/parsers';
import { mockAxios } from '../utils'; ;

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
    jest.spyOn(parsersUtils, 'latLngParser').mockReturnValue(undefined);

    s.savedProfile = { a: 1, b: 2, type: 2 };
    expect(getters.getUserProfile(s)).toEqual(s.savedProfile);
    expect(getters.getUserProfile(s)).not.toBe(s.savedProfile);

    s.savedProfile = { a: 1, b: 2 };
    expect(getters.getUserProfile(s)).toEqual({ a: 1, b: 2, type: 1, latlng: undefined });
    expect(parsersUtils.latLngParser).toHaveBeenCalled();

    parsersUtils.latLngParser.mockReturnValue(1);
    expect(getters.getUserProfile(s)).toEqual({ a: 1, b: 2, type: 1, latlng: 1 });
    expect(parsersUtils.latLngParser).toHaveBeenCalled();
  });

  test('getLoginStatus', () => {
    let getUserProfile;
    let getCsrfToken;
    let result = getters.getLoginStatus(s, {getUserProfile, getCsrfToken});
    expect(result).toBe(false);

    getUserProfile = {};
    result = getters.getLoginStatus(s, {getUserProfile, getCsrfToken});
    expect(result).toBe(false);

    getUserProfile.name = 1;
    result = getters.getLoginStatus(s, {getUserProfile, getCsrfToken});
    expect(result).toBe(false);

    getUserProfile.avatar_url = 2;
    result = getters.getLoginStatus(s, {getUserProfile, getCsrfToken});
    expect(result).toBe(false);

    getCsrfToken = 'a';
    result = getters.getLoginStatus(s, {getUserProfile, getCsrfToken});
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
    let getUserPosition;
    let result = getters.isPositionSet(s, {getUserPosition});
    expect(result).toBe(false);

    getUserPosition = {};
    result = getters.isPositionSet(s, {getUserPosition});
    expect(result).toBe(true);
  });

  test('getGithubToken', () => {
    expect(getters.getGithubToken(s)).toEqual(s.githubToken);
  });

  test('getCsrfToken', () => {
    expect(getters.getCsrfToken(s)).toEqual(s.csrfToken);
  });

  test('getSettings', () => {
    s.savedProfile = null;
    expect(getters.getSettings(s)).toEqual({});

    s.savedProfile = {};
    expect(getters.getSettings(s)).toEqual({});

    s.savedProfile = {settings: { ding: true }};
    expect(getters.getSettings(s)).toEqual(s.savedProfile.settings);
    expect(getters.getSettings(s)).not.toBe(s.savedProfile.settings);
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

  test('loadSavedProfile', async () => {
    const data = { viewer: { a: 1 } };
    actions.$axios.get.mockReturnValue({ data });
    parsersUtils.apiReadParser = jest.fn().mockReturnValue(data);
    vuex.state.savedProfile = 1;
    vuex.state.csrfToken = null;
    await actions.loadSavedProfile(vuex);
    expect(vuex.commit.mock.calls.length).toEqual(0);

    vuex.state.savedProfile = null;
    await actions.loadSavedProfile(vuex);
    expect(vuex.commit.mock.calls.length).toEqual(0);

    vuex.state.savedProfile = null;
    vuex.state.csrfToken = 'a';
    await actions.loadSavedProfile(vuex);
    expect(parsersUtils.apiReadParser.mock.calls[0]).toEqual([data]);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_SAVED_PROFILE', data]);

    data.location = {
      coordinates: [1, 2]
    };
    actions.$axios.get.mockReturnValue({ data });
    await actions.loadSavedProfile(vuex);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_USER_POSITION', data.location]);
    expect(vuex.commit.mock.calls[2]).toEqual(['SET_SAVED_PROFILE', data]);

    jest.spyOn(console, 'error').mockReturnValue(undefined);
    actions.$axios.get.mockRejectedValue();
    await actions.loadSavedProfile(vuex);
    expect(vuex.dispatch).toHaveBeenLastCalledWith('logout');
  });

  test('setUserPosition', () => {
    actions.setUserPosition(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_USER_POSITION', 1]);
  });

  test('logout', () => {
    authUtils.deleteTokens = jest.fn();
    actions.logout(vuex);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_GITHUB_TOKEN', null]);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_SAVED_PROFILE', null]);
    expect(vuex.commit.mock.calls[2]).toEqual(['SET_CSRF_TOKEN', null]);
    expect(vuex.commit.mock.calls[3]).toEqual(['SET_USER_POSITION', null]);
    expect(authUtils.deleteTokens.mock.calls.length).toEqual(1);
  });

  test('updateUserProfile', async () => {
    const profile = {name: 1};
    const data = { viewer: { a: 1 } };
    parsersUtils.apiWriteParser = jest.fn().mockReturnValue(data);
    parsersUtils.apiReadParser = jest.fn().mockReturnValue(data);
    actions.$axios.post.mockReturnValue({ data });
    await actions.updateUserProfile(vuex, profile);
    expect(actions.$axios.post.mock.calls[0]).toEqual([
      '/api/user/',
      data
    ]);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_SAVED_PROFILE', data]);
  });

  test('setGithubToken', () => {
    actions.setGithubToken(vuex, 1);
    expect(vuex.commit).toHaveBeenLastCalledWith('SET_GITHUB_TOKEN', 1);
  });

  test('setCsrfToken', async () => {
    await actions.setCsrfToken(vuex, null);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_CSRF_TOKEN', null]);

    await actions.setCsrfToken(vuex, 1);
    expect(vuex.commit.mock.calls[1]).toEqual(['SET_CSRF_TOKEN', 1]);
  });

  test('optOut', async () => {
    vuex.getters.getUserProfile = {id: 1};
    actions.$axios.delete.mockResolvedValue(true);
    await actions.optOut(vuex);
    expect(vuex.dispatch).toHaveBeenCalledWith('people/deletePerson', 1, {root: true});
    expect(actions.$axios.delete).toHaveBeenLastCalledWith('/api/user/1/');
    expect(vuex.dispatch).toHaveBeenLastCalledWith('logout');
  });
});

describe('mutations', () => {
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

  test('SET_CSRF_TOKEN', () => {
    const s = {};
    mutations.SET_CSRF_TOKEN(s, 1);
    expect(s.csrfToken).toEqual(1);
  });
});
