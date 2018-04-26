<template>
  <div class="right-side elevation-8">
    <nuxt-child class="full-height" />
  </div>
</template>

<script>
export default {
  name: 'RightSide'
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .right-side {
    position: absolute;
    right: 16px;
    top: 16px;
    z-index: 10;
    width: 33%;
    min-width: 420px;
    max-width: 540px;
    height: calc(100% - 32px);
    overflow-y: auto;
    overflow-x: hidden;
    background-color: @color-white;
    border-radius: 3px;

    // Responsive
    .viewport-sm & {
      width: calc(100vw - 32px);
      min-width: calc(100vw - 32px);
      max-width: calc(100vw - 32px);
    }
  }
</style>
