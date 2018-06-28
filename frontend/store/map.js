export const state = () => ({
  addMode: false,
  mapReady: false,
  showMeetups: true
});

export const getters = {
  isAddMode: state => {
    return state.addMode;
  },

  getMapReady: state => state.mapReady,

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
  },
  getShowMeetups: state => state.showMeetups
};

export const actions = {
  setAddMode ({commit}, value) {
    commit('SET_ADD_MODE', value);
  },
  setMapReady ({commit}) {
    commit('SET_MAP_READY', true);
  },
  setShowMeetups ({commit}, value) {
    commit('SET_SHOW_MEETUPS', value);
  }
};

export const mutations = {
  SET_ADD_MODE: (state, value) => {
    state.addMode = value;
  },
  SET_MAP_READY: (state, value) => {
    state.mapReady = value;
  },
  SET_SHOW_MEETUPS: (state, value) => {
    state.showMeetups = value;
  }
};
