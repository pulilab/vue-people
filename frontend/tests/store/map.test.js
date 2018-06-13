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

  test('getFilteredPins', () => {
    const g = {
      getFocusOn: 1
    };
    const rootGetters = {
      'people/getList': [
        {id: 1, type: 1, latlng: {}},
        {id: 2, type: 2, latlng: {}},
        {id: 3, type: 2}
      ],
      'people/getSelectedTags': []
    };
    let result = getters.getFilteredPins(null, g, null, rootGetters);
    expect(result[0]).toEqual({id: 1,
      type: 1,
      key: 1,
      options: {},
      latlng: {}
    });
    expect(result[1]).toEqual({
      id: 2,
      type: 2,
      key: 2,
      options: {},
      latlng: {}
    });
    expect(result.length).toEqual(2);

    rootGetters['people/getSelectedTags'] = ['vuex'];
    rootGetters['people/getList'] = [
      {id: 1, type: 1, tags: ['vuex'], latlng: {}},
      {id: 2, type: 2, tags: [], latlng: {}}
    ];
    result = getters.getFilteredPins(null, g, null, rootGetters);
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
