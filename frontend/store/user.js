import { deleteTokens } from '~/utilities/auth';
import { apiReadParser, apiWriteParser, latLngParser } from '~/utilities/parsers';

export const state = () => ({
  savedProfile: null,
  position: null,
  githubToken: null,
  csrfToken: null
});

export const getters = {
  getUserProfile: state => {
    const profile = {...state.savedProfile};
    const type = profile.type ? profile.type : 1;
    const latlng = latLngParser(profile);
    return {...profile, type, latlng};
  },
  getLoginStatus: (state, getters) => {
    const ghp = getters.getUserProfile;
    const csrfToken = getters.getCsrfToken;
    return !!(ghp && ghp.name && ghp.avatar_url && csrfToken);
  },
  getUserPosition: state => {
    if (state.position) {
      return state.position;
    }
    return undefined;
  },
  isPositionSet: (state, getters) => {
    return !!getters.getUserPosition;
  },
  getGithubToken: state => {
    return state.githubToken;
  },
  getCsrfToken: state => {
    return state.csrfToken;
  },
  getSettings: state => {
    return state.savedProfile && state.savedProfile.settings ? {...state.savedProfile.settings} : {};
  }
};

export const actions = {
  async loadSavedProfile ({commit, state, dispatch}) {
    if (!state.savedProfile && state.csrfToken) {
      try {
        const { data } = await this.$axios.get('/api/user/');
        const parsed = apiReadParser(data);
        if (parsed.location) {
          commit('SET_USER_POSITION', parsed.location);
        }
        commit('SET_SAVED_PROFILE', { ...parsed });
      } catch (e) {
        console.error('Invalid credentials', e);
        dispatch('logout');
      }
    }
  },
  setUserPosition ({commit}, position) {
    commit('SET_USER_POSITION', position);
  },
  logout ({commit}) {
    deleteTokens();
    commit('SET_GITHUB_TOKEN', null);
    commit('SET_SAVED_PROFILE', null);
    commit('SET_CSRF_TOKEN', null);
    commit('SET_USER_POSITION', null);
  },
  async updateUserProfile ({commit, state, getters}, update) {
    const location = getters.getUserPosition;
    const profile = apiWriteParser({...state.savedProfile, ...update, location});
    const { data } = await this.$axios.post('/api/user/', profile);
    const parsed = apiReadParser(data);
    commit('SET_SAVED_PROFILE', parsed);
  },
  setGithubToken ({commit, dispatch}, token) {
    commit('SET_GITHUB_TOKEN', token);
  },
  async setCsrfToken ({commit, dispatch}, token) {
    commit('SET_CSRF_TOKEN', token);
    if (token) {
      await dispatch('loadSavedProfile');
    }
  },
  async optOut ({dispatch, getters}) {
    const profileId = getters.getUserProfile.id;
    dispatch('people/deletePerson', profileId, {root: true});
    await this.$axios.delete(`/api/user/${profileId}/`);
    dispatch('logout');
  }
};

export const mutations = {
  SET_USER_POSITION: (state, position) => {
    state.position = position;
  },
  SET_SAVED_PROFILE: (state, profile) => {
    state.savedProfile = profile;
  },
  SET_GITHUB_TOKEN: (state, token) => {
    state.githubToken = token;
  },
  SET_CSRF_TOKEN: (state, token) => {
    state.csrfToken = token;
  }
};
