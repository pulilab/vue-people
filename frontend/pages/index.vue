<template>
  <div class="main-container">
    <v-container
      fill-height
      fluid
      pa-0>
      <v-layout
        row>
        <v-flex
          xs5
          sm4
          md3>
          <left-side />
        </v-flex>
        <v-flex
          xs7
          sm8
          md9>
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
    await store.dispatch('people/loadPeople');
  }
};
</script>

<style lang="less">
  .main-container {
    height: 100%;
  }
</style>
