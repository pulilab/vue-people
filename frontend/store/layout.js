export const state = () => ({
  optOutDialogOpen: false,
  settingsDialogOpen: false
});

export const getters = {
  getOptOutDialogOpen: state => state.optOutDialogOpen,
  getSettingsDialogOpen: state => state.settingsDialogOpen
};

export const actions = {
  setOptOutDialogOpen ({commit}, status) {
    commit('SET_OPT_OUT_DIALOG_OPEN', status);
  },
  setSettingsDialogOpen ({commit}, status) {
    commit('SET_SETTINGS_DIALOG_OPEN', status);
  }
};

export const mutations = {
  SET_OPT_OUT_DIALOG_OPEN: (state, status) => {
    state.optOutDialogOpen = status;
  },
  SET_SETTINGS_DIALOG_OPEN: (state, status) => {
    state.settingsDialogOpen = status;
  }
};
