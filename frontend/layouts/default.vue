<template>
  <v-app
    :class="['vue-people', mobileClass]"
    dark>
    <v-content>
      <nuxt/>
      <app-dialogs />
      <cookie-warning/>
      <feedback-button />
    </v-content>
  </v-app>
</template>

<script>
import AppDialogs from '~/components/AppDialogs.vue';
import CookieWarning from '~/components/CookieWarning.vue';
import FeedbackButton from '~/components/FeedbackButton.vue';

export default {
  components: {
    AppDialogs,
    CookieWarning,
    FeedbackButton
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
