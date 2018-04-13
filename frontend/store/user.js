import  { deleteTokens } from '~/utilities/auth';
import { gitHubUserProfile } from '~/integrations/github/queries';
import { gitHubGraphQlRequest, gitHubAccessTokenLink, profileMapper } from '~/integrations/github/utilities';

export const state = () => ({
  user: null,
  gitHubProfile: null,
  savedProfile: null,
  position: null,
  githubToken: null,
  sessionId: null,
  csrfToken: null
});

export const getters = {
  getUserProfile: state => {
    const profile =  {...profileMapper(state.gitHubProfile), ...state.savedProfile};
    const type = profile.type ? profile.type : 1;
    return {...profile, type};
  },
  getLoginStatus: (state, getters) => {
    const ghp = getters.getUserProfile;
    return !!(ghp && ghp.name && ghp.avatarUrl);
  },
  getUserPosition: state => {
    if(state.position){
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
  getSessionId: state => {
    return state.sessionId;
  },
  getCsrfToken: state => {
    return state.csrfToken;
  }
};

export const actions = {
  async loadGitHubProfile({commit, dispatch, getters, state}) {
    if (!state.gitHubProfile) {
      const token = getters.getGithubToken;
      const gh = gitHubGraphQlRequest(token);
      try {
        const { data } = await this.$axios.post(gh.url, gitHubUserProfile(), gh.options);
        commit('SET_USER_GITHUB_PROFILE', {...data.data.viewer });
      } catch(e) {
        if (e && e.response && e.response.status === 401) {
          dispatch('logout');
        }
        else {
          return Promise.reject(e);
        }
      }
    }
  },
  async loadSavedProfile({commit, state}) {
    if (!state.savedProfile) {
      const { data } = await this.$axios.get('/api/person/2/');
      if (data.location) {
        data.location = {
          lat: data.location.coordinates[0],
          lng: data.location.coordinates[1]
        };
        commit('SET_USER_POSITION', data.location);
      }
      commit('SET_SAVED_PROFILE', { ...data });
    }
  },
  setUserPosition({commit}, position) {
    commit('SET_USER_POSITION', position);
  },
  logout({commit}) {
    commit('SET_USER_GITHUB_PROFILE', null);
    commit('SET_GITHUB_TOKEN', null);
    commit('SET_SESSION_ID', null);
    commit('SET_CSRF_TOKEN', null);
    deleteTokens();
  },
  async updateUserProfile({commit, state}, update) {
    const profile = {...state.savedProfile, ...update};
    const { data } = await this.$axios.post('/api/person/', profile);
    commit('SET_SAVED_PROFILE', data);
  },
  async setGithubToken({commit, dispatch}, token) {
    commit('SET_GITHUB_TOKEN', token);
    if (token) {
      await dispatch('loadGitHubProfile');
    }
  },
  async setSessionId({commit, dispatch, getters}, token) {
    commit('SET_SESSION_ID', token);
    if (token) {
      await dispatch('loadSavedProfile');
    }
  },
  setCsrfToken({commit}, token) {
    commit('SET_CSRF_TOKEN', token);
  },
  async saveLocation({getters, dispatch}) {
    const loc = getters.getUserPosition;
    const location = {
      type: "Point",
      coordinates: [loc.lat, loc.lng]
    };
    await dispatch('updateUserProfile', {location});
  }
};

export const mutations = {
  SET_USER_GITHUB_PROFILE: (state, profile) => {
    state.gitHubProfile = profile;
  },
  SET_USER_POSITION: (state, position) => {
    state.position = position;
  },
  SET_SAVED_PROFILE: (state, profile) => {
    state.savedProfile = profile;
  },
  SET_GITHUB_TOKEN: (state, token) => {
    state.githubToken = token;
  },
  SET_SESSION_ID: (state, token) => {
    state.sessionId = token;
  },
  SET_CSRF_TOKEN: (state, token) => {
    state.csrfToken = token;
  }
};

