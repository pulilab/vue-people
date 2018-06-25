import { findGroups } from '../integrations/meetup/signedUrls';
import { groupParser } from '../integrations/meetup/utilities';

export const state = () => ({
  meetups: [],
  currentMeetup: null
});

export const getters = {
  getMeetups: (state) => {
    return [...state.meetups.map(m => ({...m, latlng: {...m.latlng}}))];
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
  async loadMeetups ({commit}) {
    const data = await this.$axios.get(findGroups);
    commit('SET_MEETUP_LIST', data.data);
  },
  setCurrent ({commit}, id) {
    commit('SET_CURRENT_MEETUP', id);
  }
};

export const mutations = {
  SET_MEETUP_LIST: (state, meetups) => {
    const parsed = meetups.map(groupParser);
    state.meetups = parsed;
  },
  SET_CURRENT_MEETUP: (state, id) => {
    state.currentMeetup = id;
  }
};
