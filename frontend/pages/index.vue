<template>
  <div class="main-container">
    <v-container
      fill-height
      fluid
      pa-0>
      <v-layout
        row
      >
        <v-slide-x-transition>
          <v-flex
            v-if="!hideLeft"
            class="left-aside-wrapper"
          >
            <left-side />
          </v-flex>
        </v-slide-x-transition>
        <v-flex class="main-map-wrapper">
          <main-map/>
        </v-flex>
      </v-layout>
    </v-container>
    <right-side v-if="showRight" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
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
    ...mapGetters({
      goToMap: 'getGoToMap'
    }),
    showRight () {
      return !!(this.$route.name === 'index-user');
    },
    hideLeft () {
      return this.goToMap && (this.$mq === 'xs' || this.$mq === 'sm');
    }
  },
  async fetch ({store}) {
    const peoplePromise = store.dispatch('people/loadPeople');
    const userTypePromise = store.dispatch('loadUserTypes');
    const tagsPromise = store.dispatch('loadTags');

    await Promise.all([peoplePromise, userTypePromise, tagsPromise]);
  }
};
</script>

<style lang="less">
  .main-container {
    height: 100%;
  }
</style>
