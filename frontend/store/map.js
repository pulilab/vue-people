export const state = () => ({
  addMode: false,
  zoom: 3,
  center: {lat: 0, lng: 0},
  autoCentered: false,
  focusOn: null,
  shownPins: 0
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
  getAutoCentered: (state) => {
    return state.autoCentered;
  },
  getFocusOn: (state) => {
    return state.focusOn;
  },
  getFilteredPins: (state, getters, rootState, rootGetters) => {
    const tags = rootGetters['people/getSelectedTags'];
    const list = rootGetters['people/getList'].filter(p => p.latlng);
    const filtered = tags.length > 0 ? list.filter(p => p.tags.some(t => tags.includes(t))) : list;
    return [...filtered.map(p => {
      const opacity = !getters.getFocusOn || p.type === getters.getFocusOn ? 1 : 0.5;
      // this is important, otherwise the v-for that draws them do not force repaint the marker, and the marker is not reactive
      const key = p.id + opacity;
      return {
        ...p,
        key,
        options: {
          opacity
        }
      };
    })];
  },
  getShownPins: (state) => {
    return state.shownPins;
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
  },
  setAutoCentered ({commit}, value) {
    commit('SET_AUTO_CENTERED', value);
  },
  setFocusOn ({commit}, value) {
    commit('SET_FOCUS_ON', value);
  },
  setShownPins ({commit}, value) {
    commit('SET_SHOWN_PINS', value);
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
  },
  SET_AUTO_CENTERED: (state, value) => {
    state.autoCentered = value;
  },
  SET_FOCUS_ON: (state, value) => {
    state.focusOn = value;
  },
  SET_SHOWN_PINS: (state, value) => {
    state.shownPins = value;
  }
};
