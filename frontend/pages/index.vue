<template>
  <v-container
    fluid
    fill-height>
    <main-map/>
    <bottom-buttons />
  </v-container>

</template>

<script>
import MainMap from '~/components/MainMap.vue';
import BottomButtons from '~/components/BottomButtons.vue';

export default {
  components: {
    MainMap,
    BottomButtons
  },
  async fetch({store}) {
    await store.dispatch('user/loadGitHubProfile');
  }
};
</script>

<style>

</style>
