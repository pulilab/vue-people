
<template>
  <div class="right-side elevation-24">
    <nuxt-child class="full-height" />
  </div>
</template>

<script>
export default {
  name: 'RightSide',
};
</script>

<style lang="less">

    .right-side {
      position: absolute;
      right: 32px;
      top: 32px;
      z-index: 10;
      width: 33%;
      height: calc(100% - 64px);
      overflow-y: auto;
      overflow-x: hidden;
      background-color: #FFF;

    }

</style>
