import  { deleteTokens } from '~/utilities/auth';
import { gitHubUserProfile } from '~/integrations/github/queries';
import { gitHubGraphQlRequest, gitHubAccessTokenLink, profileMapper } from '~/integrations/github/utilities';

export const state = () => ({
  user: null,
  gitHubProfile: null,
  savedProfile: null,
  position: null,
  githubToken: null
});

export const getters = {
  getUserProfile: state => {
    return {type:1, ...profileMapper(state.gitHubProfile), ...state.savedProfile};
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
  }
};

export const actions = {
  async loadGitHubProfile({commit, dispatch, getters}) {
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
  },
  setUserPosition({commit}, position) {
    commit('SET_USER_POSITION', position);
  },
  logout({commit}) {
    commit('SET_USER_GITHUB_PROFILE', null);
    commit('SET_GITHUB_TOKEN', null);
    deleteTokens();
  },
  saveUserProfile({commit}, profile) {
    commit('SET_SAVED_PROFILE', { ...profile });
  },
  async setGithubToken({commit, dispatch}, token) {
    console.log(token);
    commit('SET_GITHUB_TOKEN', token);
    if (token) {
      await dispatch('loadGitHubProfile');
    }
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
  }
};

