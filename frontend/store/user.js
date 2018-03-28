import { gitHubUserProfile } from '~/integrations/github/queries';
import { gitHubGraphQlRequest } from '~/integrations/github/utilities';

export const state = () => ({
  user: null,
  gitHubProfile: null,
  savedProfile: null,
  position: null
});

export const getters = {
  getUserProfile: state => {
    return {...state.gitHubProfile, ...state.savedProfile};
  },
  getLoginStatus: state => {
    const ghp = state.gitHubProfile;
    return ghp && ghp.name && ghp.avatarUrl;
  },
  getUserPosition: state => {
    if(state.position){
      return state.position;
    }
    return undefined;
  },
  isPositionSet: (state, getters) => {
    return !!getters.getUserPosition;
  }
};

export const actions = {
  async loadGitHubProfile({commit}) {
    const gh = gitHubGraphQlRequest();
    const { data } = await this.$axios.post(gh.url, gitHubUserProfile(), gh.options);
    commit('SET_USER_GITHUB_PROFILE', {...data.data.viewer });
  },
  setUserPosition({commit}, position) {
    commit('SET_USER_POSITION', position);
  },
  logout({commit}) {
    commit('SET_USER_GITHUB_PROFILE', null);
  },
  saveUserProfile({commit}, profile) {
    commit('SET_SAVED_PROFILE', { ...profile });
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
  }
};

