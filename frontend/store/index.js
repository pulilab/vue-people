export const state = () => ({
  userTypes: [],
  tags: []
});

export const getters = {
  getUserTypes: state => {
    return [...state.userTypes
      .map(s => ({...s}))
      .sort((a, b) => a.order - b.order)];
  },
  getUserType: (state, getters) => id => {
    return {...getters.getUserTypes.find(ut => ut.id === id)};
  },
  getTags: state => {
    return [...state.tags];
  }
};

export const actions = {
  async loadUserTypes ({commit}) {
    const { data } = await this.$axios.get('/api/user-type/');
    commit('SET_USER_TYPES', data);
  },
  async loadTags ({commit}) {
    const { data } = await this.$axios.get('/api/tags/');
    const tags = data.map(t => t.name);
    commit('SET_TAGS', tags);
  }
};

export const mutations = {
  SET_USER_TYPES: (state, types) => {
    state.userTypes = types;
  },
  SET_TAGS: (state, tags) => {
    state.tags = tags;
  }
};
