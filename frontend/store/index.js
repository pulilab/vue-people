export const state = () => ({
  userTypes: [],
  tags: ['vue', 'vuex'],
  organizations: ['Pulilab']
});


export const getters = {
  getUserTypes: state => {
    return [...state.userTypes
      .map(s => ({...s}))
      .sort((a,b) => a.order - b.order)];
  },
  getUserType: (state, getters) => id => {
    return {...getters.getUserTypes.find(ut => ut.id === id)};
  },
  getTags: state => {
    return [...state.tags];
  },
  getOrganizations: state => {
    return [...state.organizations];
  }
};

export const actions = {
  async loadUserTypes({commit}) {
    const { data } = await this.$axios.get('/api/user-type/');
    commit('SET_USER_TYPES', data);
  }
};


export const mutations = {
  SET_USER_TYPES: (state, types) => {
    return state.userTypes = types;
  }
};
