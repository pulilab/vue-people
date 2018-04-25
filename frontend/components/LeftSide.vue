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

      <h3 class="title mb-3">
        About vuepeople.org
      </h3>
      <p>
        VuePeople lists and connects Vue.JS developers around the world. <br>
        The aim of this site is for Vue.JS developers to use this tool to present themselves and their work to the world, and to provide a platform to connect with like-minded individuals.
      </p>
      <p>
        We’ve created this place so you can follow the Vue.JS community as it grows. As the site is still a work in progress, we are happy to receive your feedback and next feature suggestions at <a href="mailto:family@vuepeople.org">family@vuepeople.org</a>
      </p>

      <p>
        We credit inspiration to <a href="http://people.django.com">http://people.django.com</a>
      </p>
      <v-btn
        v-show="$mq === 'sm'"
        block
        color="primary"
        @click="setGoToMap(true)"
      >
        Go to map
        <v-icon class="ml-2">mdi-arrow-right</v-icon>
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
      return this.$route && this.$route.name !== 'index-user-id';
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
    height: 100%;
    overflow-x: hidden;
    background-color: @color-white;
  }

  .intro-text {
    height: 100%;

    .logo {
      width: auto;
      height: 56px;
      margin-bottom: 48px;
    }

    h3 {
      color: @font-dark-primary;
      letter-spacing: -0.25px !important;
    }

    p {
      margin-bottom: 24px;
      color: @font-dark-secondary;

      a {
        display: block;
      }
    }
  }

  .credit {
    z-index: 10;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 14px 24px;
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
</style>
