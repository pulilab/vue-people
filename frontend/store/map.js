export const state = () => ({
  addMode: false
});

export const getters = {
  isAddMode: state => {
    return state.addMode;
  },
  getPins: (state, getters, rootState, rootGetters) => {
    return rootGetters['people/getList'].filter(p => p.latlng);
  },
  getFilteredPins: (state, getters, rootState, rootGetters) => {
    const tags = rootGetters['people/getSelectedTags'];
    const list = getters.getPins;
    const selectedUserTypes = rootGetters['getSelectedUserTypes'];
    let filtered = [];
    filtered = tags.length > 0 ? list.filter(p => p.tags.some(t => tags.includes(t))) : list;
    filtered = selectedUserTypes.length > 0 ? filtered.filter(p => selectedUserTypes.includes(p.type)) : filtered;
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
  }
};

export const mutations = {
  SET_ADD_MODE: (state, value) => {
    state.addMode = value;
  }
};
