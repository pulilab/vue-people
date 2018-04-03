import { state, getters, actions, mutations } from '~/store/map';

test('map state is unique between calls', () => {
  const s = state();
  expect(s).not.toBe(state());
  expect(s).toEqual(state());
});

describe('getters', () => {
  let s = null;

  beforeEach(() => {
    s = state();
  });

  test('isAddMode', () => {
    expect(getters.isAddMode(s)).toEqual(s.addMode);
  });

  test('getZoom', () => {
    expect(getters.getZoom(s)).toEqual(s.zoom);
  });

  test('getCenter', () => {
    const rootState = {
      geolocation: 1
    };
    expect(getters.getCenter(s, null, rootState)).toEqual(rootState.geolocation);
    s.center = 2;
    expect(getters.getCenter(s, null, rootState)).toEqual(2);
  });

});

describe('actions', () => {
  const vuex = {};

  beforeEach(() => {
    vuex.commit = jest.fn();
  });

  test('setAddMode', () => {
    actions.setAddMode(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_ADD_MODE', 1]);
  });

  test('setZoom', () => {
    actions.setZoom(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_ZOOM', 1]);
  });

  test('setCenter', () => {
    actions.setCenter(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_CENTER', 1]);
  });

});

describe('mutations', () => {

  test('SET_ADD_MODE', () => {
    const s = {};
    mutations.SET_ADD_MODE(s, 1);
    expect(s.addMode).toEqual(1);
  });

  test('SET_ZOOM', () => {
    const s = {};
    mutations.SET_ZOOM(s, 1);
    expect(s.zoom).toEqual(1);
  });

  test('SET_CENTER', () => {
    const s = {};
    mutations.SET_CENTER(s, 1);
    expect(s.center).toEqual(1);
  });

});
