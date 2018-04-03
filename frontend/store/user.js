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
    return {...profileMapper(state.gitHubProfile), ...state.savedProfile};
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
      console.log(e.response.status);
      if ( e.response && e.response.status === 401) {
        dispatch('logout');
      }
      else {
        console.error('error fetching data from github: ', {...e});
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
    commit('SET_GITHUB_TOKEN', token);
    if (token) {
      await dispatch('loadGitHubProfile');
    }
  },
  async gitHubLogin({commit, dispatch}, code) {
    const payload = {
      client_id: process.env.gitHubClientId,
      client_secret: process.env.gitHubClientSecret,
      code,
    };
    const gh = gitHubAccessTokenLink();
    const { data } = await this.$axios.post(gh.url, payload, gh.options);
    if ( data.access_token ) {
      await dispatch('setGithubToken', data.access_token);
    } else  {
      console.error('wrong or stale github code');
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

