import { groupParser, overlappingResolver, eventParser, eventHasValidLatLng } from '../integrations/meetup/utilities';

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
    return [...state.meetups.map(m => {
      const events = getters.getEvents
        .filter(e => e.group_id === m.id && e.latlng)
        .sort((a, b) => a.time - b.time);
      const event = events[0];
      const validLatLng = eventHasValidLatLng(event);
      const latlng = event && validLatLng ? { ...event.latlng } : {...m.latlng};
      return {
        ...m,
        latlng,
        has_event_with_coords: !!(event && validLatLng),
        event,
        options: {}
      };
    })];
  },
  getCurrentMeetup: state => {
    return state.currentMeetup;
  },
  getMeetupDetails: (state, getters) => id => {
    const events = getters.getEvents.filter(e => e.group_id === id);
    return {...getters.getMeetups.find(p => p.id === id), events};
  },
  getCurrentMeetupDetails: (state, getters) => {
    const current = getters.getCurrentMeetup;
    return getters.getMeetupDetails(current);
  }
};

export const actions = {
  async loadMeetups ({commit, dispatch}) {
    const { data } = await this.$axios.get('/api/meetup/groups');
    const meetups = data.map(groupParser);
    const combed = overlappingResolver(meetups);
    commit('SET_MEETUP_LIST', combed);
  },
  setCurrent ({commit}, id) {
    commit('SET_CURRENT_MEETUP', id);
  },
  async loadEvents ({commit}, groupNames) {
    const { data } = await this.$axios.get('/api/meetup/events');
    const events = data.map(eventParser);
    const combed = overlappingResolver(events);
    commit('ADD_MEETUP_EVENTS', combed);
  }
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
