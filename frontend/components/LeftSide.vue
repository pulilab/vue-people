<template>
  <div class="left-side">
    <nuxt-child
      v-if="!showRootContent"
      class="full-height" />
    <div v-if="showRootContent" >
      DefaultLeftNav
      <pin-count />
    </div>
  </div>
</template>

<script>
import PinCount from './PinCount.vue';

export default {
  name: 'LeftSide',
  components: {
    PinCount
  },
  computed: {
    showRootContent () {
      return this.$route && this.$route.name !== 'index-user-id';
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

    .left-side {
      height: 100%;
      overflow-x: hidden;
    }
</style>
