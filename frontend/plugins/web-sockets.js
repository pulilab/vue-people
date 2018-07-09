export default ({store}) => {
  if (store &&
    store.state &&
    store.state.user &&
    store.state.user.savedProfile &&
    store.state.user.savedProfile.settings &&
    store.state.user.savedProfile.settings.websocket) {
    store.dispatch('people/openSocket');
  }
};
