export const state = () => ({
  addMode: false,
  mapReady: false,
  pinFilters: []
});

export const getters = {
  isAddMode: state => {
    return state.addMode;
  },

  getMapReady: state => state.mapReady,

  getPins: (state, getters, rootState, rootGetters) => {
    return rootGetters['people/getList'].filter(p => p.latlng);
  },
  getPinFilters: state => state.pinFilters,

  getFilteredPins: (state, getters, rootState, rootGetters) => {
    const tags = rootGetters['people/getSelectedTags'];
    const list = getters.getPins;
    const pinFilters = getters.getPinFilters;
    let filtered = [];
    filtered = tags.length > 0 ? list.filter(p => p.tags.some(t => tags.includes(t))) : list;
    filtered = pinFilters.length > 0 ? filtered.filter(p => pinFilters.includes(p.type)) : filtered;
    return [...filtered.map(p => {
      return {
        ...p,
        key: p.id,
        options: {}
      };
    })];
  },
  getShownPins: (state, getters, rootState, rootGetters) => {
    let pins = getters.getPins;
    const user = rootGetters['user/getUserProfile'];
    const countInit = rootGetters.getUserTypes.reduce((p, c) => {
      p[c.id] = 0;
      return p;
    }, {});
    if (pins) {
      pins = user.latlng ? [...pins, user] : [...pins];
      return pins.reduce((prev, c) => {
        prev[c.type] += 1;
        return prev;
      }, countInit);
    }
    return countInit;
  }
};

export const actions = {
  setAddMode ({commit}, value) {
    commit('SET_ADD_MODE', value);
  },
  setMapReady ({commit}) {
    commit('SET_MAP_READY', true);
  },
  togglePinFilters ({commit, getters}, value) {
    const index = getters.getPinFilters.indexOf(value);
    if (index === -1) {
      commit('ADD_PIN_FILTER', value);
    } else {
      commit('RM_PIN_FILTER', index);
    }
  }
};

export const mutations = {
  SET_ADD_MODE: (state, value) => {
    state.addMode = value;
  },
  SET_MAP_READY: (state, value) => {
    state.mapReady = value;
  },
  ADD_PIN_FILTER: (state, value) => {
    state.pinFilters.push(value);
  },
  RM_PIN_FILTER: (state, index) => {
    state.pinFilters.splice(index, 1);
  }
};
