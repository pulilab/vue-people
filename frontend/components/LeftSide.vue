<template>
  <div class="left-side">
    <nuxt-child
      v-if="!showRootContent"
      class="full-height" />
    <div
      v-if="showRootContent"
      class="intro-text pa-4"
    >
      <h3 class="title mb-3">Select a developer!
      </h3>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing wirl aliqua elit lorem dolor. </p>
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
    background-color: @color-brand-secondary;
  }

  .intro-text {
    h3 {
      color: @font-light-primary;
    }
    p {
      color: @font-light-disabled;
    }
  }
</style>
