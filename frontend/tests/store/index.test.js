import { state, getters, actions, mutations } from '~/store/index';
import { mockAxios } from '../utils';
import * as authUtilities from '~/utilities/auth';

test('store state is unique between calls', () => {
  const s = state();
  expect(s).not.toBe(state());
  expect(s).toEqual(state());
});

describe('getters', () => {
  let s = null;

  beforeEach(() => {
    s = state();
  });

  test('getUserTypes', () => {
    const userType = {
      name: 'core',
      disabled: true,
      id: 3,
      verbose_name: 'Vue core member',
      order: 1
    };
    s.userTypes = [userType, {...userType, order: 2, id: 2}];
    const result = getters.getUserTypes(s);
    expect(result[0]).toEqual(userType);
    expect(result[0]).not.toBe(userType);
    expect(result[1].id).toBe(2);
  });

  test('getUserType', () => {
    const getUserTypes = [{id: 1}, {id: 2}];
    const rootGetters = {
      'map/getShownPins': {1: 2}
    };
    let result = getters.getUserType(s, {getUserTypes}, null, rootGetters)(1);
    expect(result).toEqual({id: 1, count: 2});
    expect(result).not.toBe(getUserTypes[0]);

    result = getters.getUserType(s, {getUserTypes}, null, {})(2);
    expect(result).toEqual({id: 2, count: 0});
    expect(result).not.toBe(getUserTypes[0]);
  });

  test('getTags', () => {
    const result = getters.getTags(s);
    expect(result).toEqual(s.tags);
    expect(result).not.toBe(s.tags);
  });

  test('getGoToMap', () => {
    const result = getters.getGoToMap(s);
    expect(result).toEqual(s.goToMap);
  });

  test('getShowCookieWarning', () => {
    const result = getters.getShowCookieWarning(s);
    expect(result).toEqual(s.showCookieWarning);
  });

  test('getSelectedUserTypes', () => {
    const result = getters.getSelectedUserTypes(s);
    expect(result).toEqual(s.selectedUserTypes);
    expect(result).not.toBe(s.selectedUserTypes);
  });

  test('getFirstPageVisited', () => {
    const result = getters.getFirstPageVisited(s);
    expect(result).toEqual(s.firstPageVisited);
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

  test('loadUserTypes', async () => {
    actions.$axios.get.mockReturnValue({ data: 1 });
    await actions.loadUserTypes(vuex);
    expect(actions.$axios.get.mock.calls[0]).toEqual(['/api/user-type/']);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_USER_TYPES', 1]);
  });

  test('loadTags', async () => {
    actions.$axios.get.mockReturnValue({ data: [{name: 1, id: 2}] });
    await actions.loadTags(vuex);
    expect(actions.$axios.get.mock.calls[0]).toEqual(['/api/tags/']);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_TAGS', [1]]);
  });

  test('setGoToMap', () => {
    actions.setGoToMap(vuex, true);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_GO_TO_MAP', true]);
  });

  test('setShowCookieWarning', () => {
    actions.setShowCookieWarning(vuex, true);
    expect(vuex.commit).toHaveBeenLastCalledWith('SET_SHOW_COOKIE_WARNING', true);
  });

  test('acceptCookieWarning', () => {
    jest.spyOn(authUtilities, 'saveTokens').mockReturnValue(undefined);
    actions.acceptCookieWarning(vuex);
    expect(vuex.dispatch).toHaveBeenLastCalledWith('setShowCookieWarning', false);
    expect(authUtilities.saveTokens).toHaveBeenLastCalledWith(null, true);
  });


  test('toggleSelectedUserTypes', () => {
    vuex.getters.getSelectedUserTypes = [];
    actions.toggleSelectedUserTypes(vuex, 1);
    expect(vuex.commit).toHaveBeenLastCalledWith('ADD_SELECTED_USERTYPE', 1);

    vuex.getters.getSelectedUserTypes = [1];
    actions.toggleSelectedUserTypes(vuex, 1);
    expect(vuex.commit).toHaveBeenLastCalledWith('RM_SELECTED_USERTYPE', 0);
  });

  test('setFirstPageVisited', () => {
    actions.setFirstPageVisited(vuex, true);
    expect(vuex.commit).toHaveBeenLastCalledWith('SET_FIRST_PAGE_VISITED', true);

  });
});

describe('mutations', () => {
  test('SET_USER_TYPES', () => {
    const state = {};
    mutations.SET_USER_TYPES(state, 1);
    expect(state.userTypes).toEqual(1);
  });

  test('SET_TAGS', () => {
    const state = {};
    mutations.SET_TAGS(state, 1);
    expect(state.tags).toEqual(1);
  });

  test('SET_GO_TO_MAP', () => {
    const state = {};
    mutations.SET_GO_TO_MAP(state, 1);
    expect(state.goToMap).toEqual(1);
  });

  test('SET_SHOW_COOKIE_WARNING', () => {
    const state = {};
    mutations.SET_SHOW_COOKIE_WARNING(state, 1);
    expect(state.showCookieWarning).toEqual(1);
  });


  test('ADD_SELECTED_USERTYPE', () => {
    const state = {
      selectedUserTypes: []
    };
    mutations.ADD_SELECTED_USERTYPE(state, 1);
    expect(state.selectedUserTypes).toEqual([1]);
  });

  test('RM_SELECTED_USERTYPE', () => {
    const state = {
      selectedUserTypes: []
    };
    mutations.RM_SELECTED_USERTYPE(state, 0);
    expect(state.selectedUserTypes).toEqual([]);
  });

  test('SET_FIRST_PAGE_VISITED', () => {
    const state = {};
    mutations.SET_FIRST_PAGE_VISITED(state, 1);
    expect(state.firstPageVisited).toEqual(1);
  });

});
