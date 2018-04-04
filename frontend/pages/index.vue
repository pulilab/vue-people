<template>
  <div class="main-container">
    <v-container
      fill-height
      fluid>
      <v-layout
        row>
        <v-flex
          xs4 >
          <left-side />
        </v-flex>
        <v-flex xs8>
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
      console.log(this.$route.name);
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
