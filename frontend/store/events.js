import { findGroups } from '../integrations/meetup/signedUrls';
import { groupParser, overlappingResolver } from '../integrations/meetup/utilities';

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
    const meetups = data.data.map(groupParser);
    const combed = overlappingResolver(meetups);
    commit('SET_MEETUP_LIST', combed);
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
