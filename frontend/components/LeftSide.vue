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
      <h3 class="subheading mb-3">
        Connect with Vuepeople <br>
        of the world.
      </h3>
      <p>Use this tool to present yourself and your work to the world, and to discover likeminded near you.</p>
      <p>
        We’ve created this place so you can follow the community as it grows. This is still work in progress. Suggest the next feature to <br>
        <a href="mailto:family@vuepeople.org">family@vuepeople.org</a>
      </p>

      <p>
        We credit inspiration to <br>
        <a href="http://people.django.com">http://people.django.com</a>
      </p>
      <!-- TODO -->
      <!-- Remove this component as it is now, and implement a new counter in the MapLegend component, check design: https://sketch.cloud/s/LJM1l/p/vuepeople-app-v1/map-component-logged-out -->
      <!-- <pin-count /> -->
    </div>
    <div class="credit">
      <span>
        <img
          src="~/assets/images/logo-pulilab.svg"
          alt="Pulilab logo"
          class="logo"
        >
      </span>
      <span>Presented by <a href="http://pulilab.com">Pulilab</a></span>
    </div>
  </div>
</template>

<script>
// import PinCount from './PinCount.vue';

export default {
  name: 'LeftSide',
  components: {
    // PinCount
  },
  computed: {
    showRootContent () {
      return this.$route && this.$route.name !== 'index-user-id';
    }
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
    background-color: @color-brand-secondary;
  }

  .intro-text {
    height: 100%;

    .logo {
      width: auto;
      height: 48px;
      margin-bottom: 24px;
    }

    h3 {
      font-size: @font-size-base + 2;
      color: @font-light-primary;
    }

    p {
      color: @font-light-disabled;
    }
  }

  .credit {
    z-index: 100;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    width: 100%;
    padding: 24px;
    border-top: 1px solid rgba(0,0,0,.12);
    background-color: @color-brand-secondary;
    color: @font-light-disabled;

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
