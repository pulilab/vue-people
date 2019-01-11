import { gitHubUserRepositories } from '~/integrations/github/queries';
import { gitHubGraphQlRequest, filterOutNonVueAndZeroStars } from '~/integrations/github/utilities';
import { personParser } from '~/utilities/parsers';
import { playDing } from '~/utilities/media';
import { WebSocketBridge } from 'django-channels';
import qs from 'qs';

export const state = () => ({
  list: [],
  filtered: [],
  current: null,
  currentPersonRepositories: [],
  currentPersonContributed: [],
  selectedTags: [],
  peopleWebSocketBridge: null,
  peopleLibrary: {}
});

export const getters = {
  getList: (state, getters, rootState, rootGetters) => {
    const user = rootGetters['user/getUserProfile'];
    const result = [
      ...state.list.filter(p => !user || !user.id || p.id !== user.id)
    ];
    return result;
  },
  getLatestUser: (state, getters) => {
    const last = getters.getList
      .filter(u => u.name)
      .sort((a, b) => a.id - b.id)
      .slice(-1)[0];
    if (last) {
      return last.id;
    }
    return null;
  },
  getCurrentPerson: state => {
    return state.current;
  },
  getPersonDetails: (state, getters, rootState, rootGetters) => id => {
    const loggedIn = rootGetters['user/getUserProfile'];
    if (loggedIn && id === loggedIn.id) {
      return {...loggedIn};
    }
    const detailed = state.peopleLibrary[id];
    if (!detailed) {
      return { ...state.list.find(p => p.id === id) };
    }
    return { ...detailed };
  },
  getCurrentPersonDetails: (state, getters, rootState, rootGetters) => {
    const current = getters.getCurrentPerson;
    return getters.getPersonDetails(current);
  },
  getCurrentPersonRepositories: (state, getters) => {
    return [...state.currentPersonRepositories].sort((a, b) =>
      b.node.stargazers.totalCount - a.node.stargazers.totalCount
    );
  },
  getCurrentPersonContributed: (state, getters) => {
    return [...state.currentPersonContributed].sort((a, b) =>
      b.node.stargazers.totalCount - a.node.stargazers.totalCount
    );
  },
  getSelectedTags: state => {
    return [...state.selectedTags];
  }
};

export const actions = {
  async loadPeople ({commit}) {
    const { data } = await this.$axios.get('/api/people/');
    const parsed = data.map(personParser);
    commit('SET_PEOPLE_LIST', parsed);
  },
  async setCurrent ({commit}, id) {
    if (id) {
      const { data } = await this.$axios.get(`/api/person/${id}/`);
      const person = personParser(data);
      commit('SET_PERSON', {id, person});
    }
    commit('SET_CURRENT', id);
    commit('SET_CURRENT_PERSON_REPOSITORY_LIST', []);
    commit('SET_CURRENT_PERSON_CONTRIBUTED_LIST', []);
  },
  async loadRepositories ({commit, getters, rootGetters}) {
    const user = getters.getCurrentPersonDetails;
    const userToken = rootGetters['user/getGithubToken'];
    const query = gitHubUserRepositories(user.github_login);
    const gh = gitHubGraphQlRequest(userToken || process.env.gitHubApiKey);
    try {
      const { data } = await this.$axios.post(gh.url, query, gh.options);
      if (data && data.data && data.data.user) {
        const repositories = data.data.user.repositories.edges;
        const contributed = data.data.user.repositoriesContributedTo.edges;
        commit('SET_CURRENT_PERSON_REPOSITORY_LIST', filterOutNonVueAndZeroStars(repositories));
        commit('SET_CURRENT_PERSON_CONTRIBUTED_LIST', filterOutNonVueAndZeroStars(contributed));
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  },
  async setSelectedTags ({commit}, tags) {
    commit('SET_SELECTED_TAGS', tags);
    const { data } = await this.$axios({
      method: 'get',
      url: '/api/search/',
      params: {tag: tags.map(t => t.id)},
      paramsSerializer: params => qs.stringify(params, {arrayFormat: 'repeat'})
    });
    const filtered = data.map(d => d.id);
    commit('SET_FILTERED', filtered);
  },
  openSocket ({ dispatch, commit }) {
    const webSocketBridge = new WebSocketBridge();
    webSocketBridge.connect(`${process.env.webSocketProtocol}://${window.location.hostname}/ws-people`);
    webSocketBridge.listen(a => dispatch('socketAction', a));
    commit('SET_PEOPLE_WEBSOCKET_BRIDGE', webSocketBridge);
  },
  socketAction ({commit, rootGetters, state}, action) {
    if (action && action.person) {
      const person = personParser(action.person);
      const index = state.list.findIndex(p => p.id === action.person.id);
      const settings = rootGetters['user/getSettings'];
      if (index !== -1) {
        const stored = {...state.list[index]};
        commit('UPDATE_PERSON', {index, person});
        if (settings.ding && person.name && !stored.name) {
          playDing(settings.ding, person);
        }
      } else {
        commit('ADD_PERSON', person);
        if (settings.ding && person.name) {
          playDing();
        }
      }
    }
  },
  closeSocket ({commit, state}) {
    state.peopleWebSocketBridge.socket.close(1000, '', { keepClosed: true });
    commit('SET_PEOPLE_WEBSOCKET_BRIDGE', null);
  },
  deletePerson ({commit}, id) {
    commit('DELETE_PERSON', id);
  }
};

export const mutations = {
  SET_PEOPLE_LIST: (state, people) => {
    state.list = people;
  },
  SET_PERSON: (state, {id, person}) => {
    state.peopleLibrary[id] = {...person};
  },
  ADD_PERSON: (state, person) => {
    state.list.push(person);
    state.peopleLibrary[person.id] = {...person};
  },
  UPDATE_PERSON: (state, {person, index}) => {
    state.list.splice(index, 1, person);
    state.peopleLibrary[person.id] = {...person};
  },
  DELETE_PERSON: (state, id) => {
    const index = state.list.findIndex(p => p.id === id);
    state.list.splice(index, 1);
    state.peopleLibrary[id] = undefined;
  },
  SET_CURRENT: (state, id) => {
    state.current = id;
  },
  SET_CURRENT_PERSON_REPOSITORY_LIST: (state, repositories) => {
    state.currentPersonRepositories = repositories;
  },
  SET_CURRENT_PERSON_CONTRIBUTED_LIST: (state, repositories) => {
    state.currentPersonContributed = repositories;
  },
  SET_SELECTED_TAGS: (state, tags) => {
    state.selectedTags = [...tags];
  },
  SET_PEOPLE_WEBSOCKET_BRIDGE: (state, ws) => {
    state.peopleWebSocketBridge = ws;
  },
  SET_FILTERED: (state, filtered) => {
    state.filtered = filtered;
  }
};
