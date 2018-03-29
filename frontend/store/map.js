import { root } from "postcss";

export const state = () => ({
  addMode: false,
  zoom: 13,
  center: null
});

export const getters = {
  isAddMode: state => {
    return state.addMode;
  },
  getZoom: state => {
    return state.zoom;
  },
  getCenter: (state, getters, rootState) => {
    return state.center ? state.center : rootState.geolocation;
  }
};

export const actions = {
  setAddMode({commit}, value) {
    commit('SET_ADD_MODE', value);
  },
  setZoom({commit}, value) {
    commit('SET_ZOOM', value);
  },
  setCenter({commit}, value) {
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

