<template>
  <div class="main-container">
    <v-container
      fill-height
      fluid
      pa-0>
      <v-layout
        row>
        <v-flex class="left-aside-wrapper">
          <left-side />
        </v-flex>
        <v-flex class="main-map-wrapper">
          <main-map/>
        </v-flex>
      </v-layout>
    </v-container>
    <right-side v-if="showRight" />
  </div>
</template>

<script>
import MainMap from '~/components/MainMap.vue';
import LeftSide from '~/components/LeftSide.vue';
import RightSide from '~/components/RightSide.vue';

export default {
  components: {
    MainMap,
    LeftSide,
    RightSide
  },
  computed: {
    showRight () {
      return !!(this.$route.name === 'index-user');
    }
  },
  async fetch({store}) {
    const peoplePromise =  store.dispatch('people/loadPeople');
    const userTypePromise =  store.dispatch('loadUserTypes');

    await Promise.all([peoplePromise, userTypePromise]);
  }
};
</script>

<style lang="less">
  .main-container {
    height: 100%;
  }
</style>
