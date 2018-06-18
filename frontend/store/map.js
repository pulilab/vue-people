export const state = () => ({
  addMode: false,
  centerOnCurrentPerson: false
});

export const getters = {
  isAddMode: state => {
    return state.addMode;
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
    let pins = getters.getFilteredPins;
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
  },
  getCenterOnCurrentPerson: state => state.centerOnCurrentPerson
};

export const actions = {
  setAddMode ({commit}, value) {
    commit('SET_ADD_MODE', value);
  },
  setCenterOnCurrentPerson ({commit}, value) {
    commit('SET_CENTER_ON_CURRENT', value);
  }
};

export const mutations = {
  SET_ADD_MODE: (state, value) => {
    state.addMode = value;
  },
  SET_CENTER_ON_CURRENT: (state, value) => {
    state.centerOnCurrentPerson = value;
  }
};
