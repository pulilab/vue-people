<template>
  <v-toolbar
    v-show="!hideToolbar"
    class="map-toolbar"
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
  .map-toolbar {
    position: absolute;
    top: 16px;
    right: 0;
    z-index: 10;
  }
</style>
