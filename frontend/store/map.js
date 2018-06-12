export const state = () => ({
  addMode: false,
  zoom: 3,
  center: {lat: 0, lng: 0}
});

export const getters = {
  isAddMode: state => {
    return state.addMode;
  },
  getZoom: (state) => {
    return state.zoom;
  },
  getCenter: (state) => {
    return { ...state.center };
  },
  getFilteredPins: (state, getters, rootState, rootGetters) => {
    const tags = rootGetters['people/getSelectedTags'];
    const list = rootGetters['people/getList'].filter(p => p.latlng);
    const filtered = tags.length > 0 ? list.filter(p => p.tags.some(t => tags.includes(t))) : list;
    return [...filtered.map(p => {
      return {
        ...p,
        key: p.id,
        options: {}
      };
    })];
  },
  getShownPins: (state, getters, rootState, rootGetters) => {
    const pins = getters.getFilteredPins;
    const countInit = rootGetters.getUserTypes.reduce((p, c) => {
      p[c.id] = 0;
      return p;
    }, {});
    if (pins) {
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
  setZoom ({commit}, value) {
    commit('SET_ZOOM', value);
  },
  setCenter ({commit}, value) {
    commit('SET_CENTER', value);
  }
};

export const mutations = {
  SET_ADD_MODE: (state, value) => {
    state.addMode = value;
  },
  SET_ZOOM: (state, value) => {
    state.zoom = value;
  },
  SET_CENTER: (state, value) => {
    state.center = value;
  }
};
