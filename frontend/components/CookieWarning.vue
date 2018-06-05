<template>
  <v-slide-x-transition>
    <div
      v-if="showCookieWarning"
      class="cookie-warning">
      <v-layout
        justify-center
        align-center>
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
  .cookie-warning {
    position: fixed;
    overflow: hidden;
    box-sizing: border-box;
    z-index: 9999;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    background: white;
    color: black;
    padding: 8px;
  }
</style>
