<template>
  <v-app
    :class="['vue-people', mobileClass]"
    dark>
    <v-content>
      <nuxt/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  computed: {
    mobileClass () {
      return `viewport-${this.$mq}`;
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .vue-people {
    height: 100vh;

    .content {
      height: 100%;
    }
  }
</style>
