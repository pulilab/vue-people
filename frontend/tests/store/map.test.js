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
    s.center = {lat: 1, lng: 2};
    expect(getters.getCenter(s)).toEqual(s.center);
    expect(getters.getCenter(s)).not.toBe(s.center);
  });

  test('getAutoCentered', () => {
    s.autoCentered = true;
    expect(getters.getAutoCentered(s)).toEqual(s.autoCentered);
  });

  test('getFocusOn', () => {
    s.focusOn = 1;
    expect(getters.getFocusOn(s)).toEqual(s.focusOn);
  });

  test('getFilteredPins', () => {
    const g = {
      getFocusOn: 1
    };
    const rootGetters = {
      'people/getList': [{id: 1, type: 1}, {id: 2, type: 2}]
    };
    const result = getters.getFilteredPins(null, g, null, rootGetters);
    expect(result[0]).toEqual({id: 1, type: 1, key: 2, options: {opacity: 1}});
    expect(result[1]).toEqual({id: 2, type: 2, key: 2.5, options: {opacity: 0.5}});
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

  test('setAutoCentered', () => {
    actions.setAutoCentered(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_AUTO_CENTERED', 1]);
  });

  test('setFocusOn', () => {
    actions.setFocusOn(vuex, 1);
    expect(vuex.commit.mock.calls[0]).toEqual(['SET_FOCUS_ON', 1]);
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

  test('SET_AUTO_CENTERED', () => {
    const s = {};
    mutations.SET_AUTO_CENTERED(s, true);
    expect(s.autoCentered).toEqual(true);
  });

  test('SET_FOCUS_ON', () => {
    const s = {};
    mutations.SET_FOCUS_ON(s, 1);
    expect(s.focusOn).toEqual(1);
  });

});
