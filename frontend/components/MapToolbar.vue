<template>
  <v-toolbar
    v-show="!hideToolbar"
    class="map-toolbar elevation-8 ma-0 pa-0"
    floating
    light
  >
    <user-menu />
  </v-toolbar>
</template>

<script>
import UserMenu from './UserMenu.vue';
export default {
  name: 'MapToolabar',
  components: {
    UserMenu
  },
  computed: {
    hideToolbar () {
      return this.$route.name === 'index-user';
    }
  }
};
</script>

<style lang="less">
  @import "../assets/style/variables.less";
  @import "../assets/style/mixins.less";

  .map-toolbar {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 20;
    height: @map-card-height !important;
    border-radius: 3px;
    background-color: rgba(255,255,255,.94) !important;

    .toolbar__content {
      height: @map-card-height !important;
    }
  }
</style>
