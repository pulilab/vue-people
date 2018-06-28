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
      const leftRoutes = ['index-user-id', 'index-meetup-id'];
      return this.goToMap && (this.$mq === 'xs' || this.$mq === 'sm') && !leftRoutes.includes(this.$route.name);
    }
  },
  async fetch ({store}) {
    const peoplePromise = store.dispatch('people/loadPeople');
    const userTypePromise = store.dispatch('loadUserTypes');
    const tagsPromise = store.dispatch('loadTags');
    const meetupGroupPromise = store.dispatch('events/loadMeetups');
    const meetupEventsPromise = store.dispatch('events/loadEvents');
    await Promise.all([peoplePromise, userTypePromise, tagsPromise, meetupGroupPromise, meetupEventsPromise]);
  }
};
</script>

<style lang="less">
  .main-container {
    position: relative;
    height: 100vh;

    .left-aside-wrapper {
      z-index: 2;
      position: relative;
      min-width: 320px;
      max-width: 320px;
      height: 100vh;
    }

    .main-map-wrapper {
      z-index: 1;
      width: 100%;
    }

    // Responsive
    .viewport-sm & {
      .left-aside-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 320px;
        height: 100%;
        display: block;
      }
    }
  }
</style>
