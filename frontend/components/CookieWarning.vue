<template>
  <v-slide-x-transition>
    <div
      v-if="showCookieWarning"
      class="cookie-warning elevation-24">
      <v-layout
        justify-center>
        <v-flex>
          <p>
            This website uses cookies to store some information that allow the authentication system to work properly.
            Please accept the fact that without cookies we are not able to log you in. And yes we will store your acceptance of this message
            in the cookies too.
          </p>
        </v-flex>
        <v-flex>
          <v-btn
            class="primary"
            @click="accept()">
            Okay
          </v-btn>
        </v-flex>
      </v-layout>
    </div>
  </v-slide-x-transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  computed: {
    ...mapGetters({
      showCookieWarning: 'getShowCookieWarning'
    })
  },
  methods: {
    ...mapActions({
      acceptCookieWarning: 'acceptCookieWarning'
    }),
    accept () {
      this.acceptCookieWarning();
    }
  }
};
</script>

<style lang="less">

  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .cookie-warning {
    position: fixed;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 9999;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    background: fade(@color-white, 96%);
    color: black;
    padding: 16px 24px;

    p {
      margin: 0;
      padding-right: 48px;
      color: @font-dark-secondary;
    }

    .btn {
      margin: 0;
    }

    // Responsive
    .viewport-sm & {
      padding: 24px;

      .layout {
        flex-direction: column;
      }

      p {
        margin-bottom: 16px;
        padding: 0;
      }
    }
  }
</style>
