import Vue from 'vue';
import VuexGeolocation from 'vuex-geolocation';

export default ({store}) => {
  const vuexGeolocation = VuexGeolocation.sync(store);
  Vue.use(vuexGeolocation);
};
