import { findGroups } from '../integrations/meetup/signedUrls';
import { groupParser } from '../integrations/meetup/utilities';
import { circleOfCoords } from '../utilities/coords';

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
    const dict = meetups.reduce((p, c, index) => {
      const key = JSON.stringify(c.latlng);
      if (p[key]) {
        p[key].push(index);
      } else {
        p[key] = [index];
      }
      return p;
    }, {});
    for (const k in dict) {
      if (dict[k].length > 1) {
        const latlng = JSON.parse(k);
        const circle = circleOfCoords(latlng, dict[k].length);
        console.log(circle.length, dict[k].length);
        dict[k].forEach((value, index) => {
          meetups[value].latlng = circle[index];
        });
      }
    }
    commit('SET_MEETUP_LIST', meetups);
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
