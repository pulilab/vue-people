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

  test('getMapReady', () => {
    expect(getters.getMapReady(s)).toEqual(s.mapReady);
  });

  test('getPins', () => {
    const rootGetters = {
      'people/getList': [
        {id: 1, type: 1, latlng: {}},
        {id: 2, type: 2}
      ]
    };
    const result = getters.getPins(null, null, null, rootGetters);
    expect(result.length).toBe(1);
  });

  test('getPinFilters', () => {
    expect(getters.getPinFilters(s)).toEqual(s.pinFilters);
  });

  test('getFilteredPins', () => {
    const g = {
      getFocusOn: 1,
      getPins: [
        {id: 1, type: 1, latlng: {}},
        {id: 2, type: 2, latlng: {}}
      ],
      getPinFilters: []
    };
    const rootState = {
      people: {
        filtered: []
      }
    };
    let result = getters.getFilteredPins(null, g, rootState);
    expect(result.length).toEqual(2);

    g.getPinFilters = [2];
    result = getters.getFilteredPins(null, g, rootState);
    expect(result.length).toEqual(1);

    g.getPinFilters = [1, 2];

    rootState.people.filtered = [1];
    g.getPins = [
      {id: 1, type: 1, tags: ['vuex'], latlng: {}},
      {id: 2, type: 2, tags: [], latlng: {}}
    ];
    result = getters.getFilteredPins(null, g, rootState );
    expect(result[0]).toEqual({id: 1, type: 1, key: 1, options: {}, tags: ['vuex'], latlng: {}});
    expect(result.length).toEqual(1);
  });

  test('getShownPins', () => {
    const getFilteredPins = [{type: 1}, {type: 1}, {type: 2}];
    const getUserTypes = [{id: 1}, {id: 2}];
    const getUserProfile = {type: 1};
    expect(getters.getShownPins(
      null,
      { getFilteredPins },
      null,
      { getUserTypes, 'user/getUserProfile': getUserProfile }
    ))
      .toEqual({1: 2, 2: 1});

    getUserProfile.latlng = [];
    expect(getters.getShownPins(
      null,
      { getFilteredPins },
      null,
      { getUserTypes, 'user/getUserProfile': getUserProfile }
    ))
      .toEqual({1: 3, 2: 1});
    expect(getters.getShownPins(null, {}, null, {getUserTypes}))
      .toEqual({1: 0, 2: 0});
  });
});

describe('actions', () => {
  const vuex = {};

  beforeEach(() => {
    vuex.commit = jest.fn();
  });

  test('setAddMode', () => {
    actions.setAddMode(vuex, 1);
    expect(vuex.commit).toHaveBeenLastCalledWith('SET_ADD_MODE', 1);
  });

  test('setMapReady', () => {
    actions.setMapReady(vuex);
    expect(vuex.commit).toHaveBeenLastCalledWith('SET_MAP_READY', true);
  });

  test('togglePinFilters', () => {
    vuex.getters = {
      getPinFilters: []
    };
    actions.togglePinFilters(vuex, 1);
    expect(vuex.commit).toHaveBeenCalledWith('ADD_PIN_FILTER', 1);

    vuex.getters = {
      getPinFilters: [1]
    };
    actions.togglePinFilters(vuex, 1);
    expect(vuex.commit).toHaveBeenLastCalledWith('RM_PIN_FILTER', 0);
  });
});

describe('mutations', () => {
  test('SET_ADD_MODE', () => {
    const s = {};
    mutations.SET_ADD_MODE(s, 1);
    expect(s.addMode).toEqual(1);
  });
  test('SET_MAP_READY', () => {
    const s = {};
    mutations.SET_MAP_READY(s, 1);
    expect(s.mapReady).toEqual(1);
  });

  test('ADD_PIN_FILTER', () => {
    const s = {
      pinFilters: []
    };
    mutations.ADD_PIN_FILTER(s, 1);
    expect(s.pinFilters).toEqual([1]);
  });

  test('RM_PIN_FILTER', () => {
    const s = {
      pinFilters: []
    };
    mutations.RM_PIN_FILTER(s, 0);
    expect(s.pinFilters).toEqual([]);
  });
});
