export const state = () => ({
  userTypes: [
    {
      id: 1,
      order: 2,
      name: 'Vue dev',
      class: 'dev',
      disabled: false
    },
    {
      id: 2,
      order: 3,
      name: 'Vue enthusiast',
      class: 'enthusiast',
      disabled: false
    },
    {
      id: 3,
      order: 1,
      name: 'Vue core member',
      class: 'core',
      disabled: true
    }
  ],
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
}
;
