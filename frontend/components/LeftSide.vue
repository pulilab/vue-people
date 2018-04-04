<template>
  <div class="left-side">
    <nuxt-child v-if="!showRootContent" />
    <div v-if="showRootContent" >
      DefaultLeftNav
    </div>
  </div>
</template>

<script>
export default {
  name: 'LeftSide',
  computed: {
    showRootContent () {
      return this.$route && this.$route.name !== 'index-user-id';
    }
  }
};
</script>

<style lang="less">

    .left-side {
      height: 100%;
      overflow-x: hidden;
    }

</style>
