export const state = () => ({
  meetups: [],
  currentMeetup: null
});

export const getters = {
  getMeetups: (state) => {
    return [...state.meetups.map(m => ({...m}))];
  },
  getCurrentMeetup: state => {
    return state.currentMeetup;
  },
  getMeetupDetails: (state, getters) => id => {
    return {...getters.getMeetups.find(p => p.id === id)};
  },
  getCurrentMeetupDetails: (state, getters) => {
    const current = getters.getCurrentMeetup;
    return getters.getMeetupDetails(current);
  }
};

export const actions = {
  loadMeetups ({commit}) {
    const mockMeetup = {id: 1};
    commit('SET_MEETUP_LIST', [mockMeetup]);
  },
  setCurrent ({commit}, id) {
    commit('SET_CURRENT_MEETUP', id);
  }
};

export const mutations = {
  SET_MEETUP_LIST: (state, meetups) => {
    state.meetups = meetups;
  },
  SET_CURRENT_MEETUP: (state, id) => {
    state.currentMeetup = id;
  }
};
