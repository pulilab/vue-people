
<template>
  <div class="right-side">
    <nuxt-child />
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
    }

</style>
