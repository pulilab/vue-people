import { state, getters, actions, mutations } from '~/store/index';
import { mockAxios } from '../utils';

test('store state is unique between calls', () => {
  const s = state();
  expect(s).not.toBe(state());
  expect(s).toEqual(state());
});


describe('getters', ()  => {
  let s = null;

  beforeEach(() => {
    s = state();
  });

  test('getUserTypes', () => {
    const userType =  {
      name: 'core',
      disabled: true,
      id: 3,
      verbose_name: 'Vue core member',
      order: 1,
    };
    s.userTypes = [userType, {...userType, order: 2, id: 2}];
    const result = getters.getUserTypes(s);
    expect(result[0]).toEqual(userType);
    expect(result[0]).not.toBe(userType);
    expect(result[1].id).toBe(2);
  });

  test('getUserType', () => {
    const getUserTypes = [{id: 1}, {id:2}];
    const result = getters.getUserType(s, {getUserTypes})(1);
    expect(result).toEqual(getUserTypes[0]);
    expect(result).not.toBe(getUserTypes[0]);
  });

  test('getTags', () => {
    const result = getters.getTags(s);
    expect(result).toEqual(s.tags);
    expect(result).not.toBe(s.tags);
  });

  test('getOrganizations', () => {
    const result = getters.getOrganizations(s);
    expect(result).toEqual(s.organizations);
    expect(result).not.toBe(s.organizations);
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

});


describe('mutations', () => {
  test('SET_USER_TYPES', () => {
    const state = {};
    mutations.SET_USER_TYPES(state, 1);
    expect(state.userTypes).toEqual(1);
  });
});
