<template>
  <v-app
    :class="['vue-people', mobileClass]"
    dark>
    <v-content>
      <nuxt/>
      <app-dialogs />
      <cookie-warning/>
    </v-content>
  </v-app>
</template>

<script>
import AppDialogs from '~/components/AppDialogs.vue';
import CookieWarning from '~/components/CookieWarning.vue';

export default {
  components: {
    AppDialogs,
    CookieWarning
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
