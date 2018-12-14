import { saveTokens } from '~/utilities/auth';

export const state = () => ({
  userTypes: [],
  tags: [],
  goToMap: false,
  showCookieWarning: true,
  firstPageVisited: null

});

export const getters = {
  getUserTypes: state => {
    return [...state.userTypes
      .map(s => ({...s}))
      .sort((a, b) => a.order - b.order)];
  },
  getUserType: (state, getters, rootState, rootGetters) => id => {
    const pinCount = rootGetters['map/getShownPins'];
    const type = getters.getUserTypes.find(ut => ut.id === id);
    const count = pinCount && type ? pinCount[type.id] : 0;
    return { ...type, count };
  },
  getTags: state => {
    return [...state.tags];
  },
  getGoToMap: state => {
    return state.goToMap;
  },
  getShowCookieWarning: state => {
    return state.showCookieWarning;
  },
  getFirstPageVisited: state => state.firstPageVisited
};

export const actions = {
  async loadUserTypes ({commit}) {
    const { data } = await this.$axios.get('/api/user-type/');
    commit('SET_USER_TYPES', data);
  },
  async loadTags ({commit}) {
    const { data } = await this.$axios.get('/api/tags/');
    commit('SET_TAGS', data);
  },
  setGoToMap ({commit}, value) {
    commit('SET_GO_TO_MAP', value);
  },
  setShowCookieWarning ({commit}, value) {
    commit('SET_SHOW_COOKIE_WARNING', value);
  },
  acceptCookieWarning ({dispatch}) {
    saveTokens(null, true);
    dispatch('setShowCookieWarning', false);
  },
  setFirstPageVisited ({commit}, value) {
    commit('SET_FIRST_PAGE_VISITED', value);
  }
};

export const mutations = {
  SET_USER_TYPES: (state, types) => {
    state.userTypes = types;
  },
  SET_TAGS: (state, tags) => {
    state.tags = tags;
  },
  SET_GO_TO_MAP: (state, value) => {
    state.goToMap = value;
  },
  SET_SHOW_COOKIE_WARNING: (state, value) => {
    state.showCookieWarning = value;
  },
  SET_FIRST_PAGE_VISITED: (state, value) => {
    state.firstPageVisited = value;
  }
};
