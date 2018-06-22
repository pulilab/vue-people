<template>
  <div class="left-side">
    <nuxt-child
      v-if="!showRootContent"
      class="full-height" />
    <div
      v-if="showRootContent"
      class="intro-text pa-4"
    >
      <img
        src="~/assets/images/logo-vuepeople.svg"
        alt="VuePeople logo"
        class="logo"
      >

      <h4 class="subheading mb-3">
        About vuepeople.org
      </h4>

      <p>
        VuePeople lists and connects Vue.JS developers around the world. <br>
        The aim of this site is for Vue.JS developers to use this tool to present themselves and their work to the world, and to provide a platform to connect with like-minded individuals.
      </p>

      <p>
        We’ve created this place so you can follow the Vue.JS community as it grows.
        As the site is still a work in progress, we are happy to receive your feedback and next feature,
        either as a ticket, or as a pull request here:
        <a
          href="https://github.com/pulilab/vue-people"
          target="_blank">https://github.com/pulilab/vue-people
        </a>
      </p>

      <v-btn
        v-show="showGoToMapButton"
        block
        color="primary"
        class="btn-gotomap"
        @click="setGoToMap(true)"
      >
        Go to map
        <v-icon class="ml-1">mdi-arrow-right</v-icon>
      </v-btn>
    </div>
    <div class="credit elevation-6">
      <span>
        <img
          src="~/assets/images/logo-pulilab.svg"
          alt="Pulilab logo"
          class="logo"
        >
      </span>
      <span>Created with love by <a href="http://pulilab.com">Pulilab</a></span>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'LeftSide',
  computed: {
    showRootContent () {
      const leftRoutes = ['index-user-id', 'index-meetup-id'];
      return this.$route && !leftRoutes.includes(this.$route.name);
    },
    showGoToMapButton () {
      return this.$mq === 'sm' || this.$mq === 'xs';
    }
  },
  methods: {
    ...mapActions({
      setGoToMap: 'setGoToMap'
    })
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .left-side {
    position: relative;
    overflow-x: hidden;
    overflow-y: hidden;
    height: 100vh;
    background-color: @color-white;

    .intro-text {
      height: calc(100% - 64px);
      overflow-y: auto;

      .logo {
        width: auto;
        height: 56px;
        margin-bottom: 40px;
      }

      h4 {
        color: @font-dark-primary;
        letter-spacing: -0.25px !important;
      }

      p {
        margin-bottom: 24px;
        color: @font-dark-secondary;

        a {
          white-space: nowrap;
        }
      }

      .btn-gotomap {
        float: left;
        margin: 8px 0 48px;
      }
    }

    .credit {
      z-index: 10;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 320px;
      height: 64px;
      display: flex;
      align-items: center;
      padding: 14px 24px 14px 20px;
      background-color: @color-white;
      color: @font-dark-secondary;

      > span {
        height: 36px;
        line-height: 36px;
      }

      .logo {
        width: 36px;
        height: 36px;
        margin-right: 12px;
      }
    }

    // Responsive
    .viewport-sm & {
      // elevation 8
      box-shadow: 0px 5px 5px -3px rgba(0, 0, 0, .2), 0px 8px 10px 1px rgba(0, 0, 0, .14), 0px 3px 14px 2px rgba(0, 0, 0, .12) !important;
    }
  }
</style>
