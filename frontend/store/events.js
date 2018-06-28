import { findGroups } from '../integrations/meetup/signedUrls';
import { groupParser, overlappingResolver } from '../integrations/meetup/utilities';

export const state = () => ({
  meetups: [],
  meetupEvents: [],
  currentMeetup: null
});

export const getters = {
  getEvents: state => {
    return [...state.meetupEvents];
  },
  getMeetups: (state, getters) => {
    const events = getters.getEvents;
    return [...state.meetups.map(m => {
      const event = events.filter(e => e.group_id === m.id)[0];
      const latlng = event && event.venue ? { lat: event.venue.lat, lng: event.venue.lon } : {...m.latlng};
      return {
        ...m,
        latlng,
        options: {}
      };
    })];
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
  async loadMeetups ({commit, dispatch}) {
    const { data } = await this.$axios.get(findGroups);
    const meetups = data.map(groupParser);
    const combed = overlappingResolver(meetups);
    commit('SET_MEETUP_LIST', combed);
  },
  setCurrent ({commit}, id) {
    commit('SET_CURRENT_MEETUP', id);
  },
  async loadEvents ({commit}, groupNames) {}
};

export const mutations = {
  SET_MEETUP_LIST: (state, meetups) => {
    state.meetups = meetups;
  },
  SET_CURRENT_MEETUP: (state, id) => {
    state.currentMeetup = id;
  },
  ADD_MEETUP_EVENTS: (state, events) => {
    state.meetupEvents = events;
  }
};
