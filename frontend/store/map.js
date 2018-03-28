export const state = () => ({
  addMode: false
});

export const getters = {
  isAddMode: state => {
    return state.addMode;
  }
};

export const actions = {
  setAddMode({commit}, value) {
    commit('SET_ADD_MODE', value);
  }
};

export const mutations = {
  SET_ADD_MODE: (state, value) => {
    state.addMode = value;
  }
};

