<template>
  <v-app
    :class="['vue-people', mobileClass]"
    dark>
    <v-content>
      <nuxt/>
      <AppDialogs />
    </v-content>
  </v-app>
</template>

<script>
import AppDialogs from '~/components/AppDialogs.vue';

export default {
  components: {
    AppDialogs
  },
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
