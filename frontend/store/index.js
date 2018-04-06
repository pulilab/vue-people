export const state = () => ({
  userTypes: [
    {
      id: 1,
      name: 'Vue dev',
      class: 'dev',
      available: true
    },
    {
      id: 2,
      name: 'Vue Enthusiast',
      class: 'enthusiast',
      available: true
    },
    {
      id: 3,
      name: 'Vue core member',
      class: 'core',
      available: false
    }
  ],
  tags: ['vue', 'vuex'],
  organizations: ['Pulilab']
});


export const getters = {
  getUserTypes: state => {
    return [...state.userTypes.map(s => ({...s}))];
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
}
;
