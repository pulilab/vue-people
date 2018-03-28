<template>
  <v-container
    fluid
    fill-height>
    <nuxt-child />
    <top-informations />
    <main-map/>
    <bottom-buttons />
  </v-container>
</template>

<script>
import MainMap from '~/components/MainMap.vue';
import BottomButtons from '~/components/BottomButtons.vue';
import TopInformations from '~/components/TopInformations.vue';

export default {
  components: {
    MainMap,
    BottomButtons,
    TopInformations
  },
  transition: 'none',
  async fetch({store}) {
    await store.dispatch('user/loadGitHubProfile');
    await store.dispatch('people/loadPeople');
  }
};
</script>

<style>

</style>
