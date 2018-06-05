export const state = () => ({
  optOutDialogOpen: false
});

export const getters = {
  getOptOutDialogOpen: state => {
    return state.optOutDialogOpen;
  }
};

export const actions = {
  setOptOutDialogOpen ({commit, dispatch}, status) {
    commit('SET_OUT_OUT_DIALOG_OPEN', status);
  }
};

export const mutations = {
  SET_OUT_OUT_DIALOG_OPEN: (state, status) => {
    state.optOutDialogOpen = status;
  }
};
