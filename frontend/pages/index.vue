<template>
  <v-container
    fluid
    fill-height>
    <top-informations />
    <main-map/>
    <bottom-buttons />
    <div class="child-container">
      <nuxt-child />
    </div>
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
  }
};
</script>

<style>

</style>
